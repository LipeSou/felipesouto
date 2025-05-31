import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  private readonly deathY = 600;
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private leftPressed = false;
  private rightPressed = false;
  private jumpPressed = false;
  private ground!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("MainScene");
  }

  preload() {
    // Spritesheets
    this.load.spritesheet(
      "player_idle",
      import.meta.env.BASE_URL + "assets/PlayerIdle.png",
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      "player_run",
      import.meta.env.BASE_URL + "assets/PlayerRun.png",
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      "player_jump",
      import.meta.env.BASE_URL + "assets/PlayerIdle.png",
      { frameWidth: 128, frameHeight: 128 }
    ); // Trocar se tiver animação própria de jump

    // Imagens
    this.load.image("ground", import.meta.env.BASE_URL + "assets/Platform.png");
    this.load.image(
      "btn_left",
      import.meta.env.BASE_URL + "assets/ButtonLeft.png"
    );
    this.load.image(
      "btn_right",
      import.meta.env.BASE_URL + "assets/ButtonRight.png"
    );
    this.load.image(
      "btn_jump",
      import.meta.env.BASE_URL + "assets/ButtonJump.png"
    );
    this.load.image(
      "bug",
      "https://opengameart.org/sites/default/files/enemy-bug.png"
    );
  }

  create() {
    const isMobile =
      this.sys.game.device.os.android || this.sys.game.device.os.iOS;

    // Multi-touch
    this.input.addPointer(2);
    this.input.mouse?.disableContextMenu();

    // Input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      // Lide com a ausência do teclado (ex: mobile puro)
      this.cursors = undefined as never;
    }

    // Mapa e chão
    this.physics.world.setBounds(0, 0, 1600, 600);
    this.cameras.main.setBounds(0, 0, 1600, 600);
    this.ground = this.physics.add.staticGroup();
    this.ground.create(300, 610, "ground").setScale(1).refreshBody();

    // Player
    this.player = this.physics.add
      .sprite(100, 460, "player_idle")
      .setOrigin(0.5, 1);
    this.player.setCollideWorldBounds(true);
    this.player.setOffset(0, -8);

    // Animações
    this.createAnimations();

    // Câmera
    this.configCamera();

    // Controles mobile
    if (isMobile) this.createMobileControls();

    // Físicas
    this.physics.add.collider(this.player, this.ground);

    // Inimigos
    this.spawnBug(400, 565);

    // Evita scroll ao pressionar espaço
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") e.preventDefault();
    });
  }

  update() {
    if (!this.cursors) return;
    const moveLeft = this.cursors.left.isDown || this.leftPressed;
    const moveRight = this.cursors.right.isDown || this.rightPressed;
    const jump =
      this.cursors.up.isDown || this.cursors.space?.isDown || this.jumpPressed;
    const isTouchingGround = this.player.body?.touching.down;
    const isMoving = moveLeft || moveRight;

    // Movimento lateral
    if (moveLeft) {
      this.player.setVelocityX(-160);
      this.player.setFlipX(true);
    } else if (moveRight) {
      this.player.setVelocityX(160);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    // Pulo
    if (jump && isTouchingGround) this.player.setVelocityY(-330);

    // Animação
    if (!isTouchingGround) this.player.play("jump", true);
    else if (isMoving) this.player.play("run", true);
    else this.player.play("idle", true);

    // "Morte"
    if (this.player.y > this.deathY) this.handlePlayerDeath();
  }

  private createAnimations() {
    // Se quiser refinar, pode criar um utilitário para evitar repetição
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player_idle", {
        start: 0,
        end: 7,
      }),
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player_run", {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player_run", {
        start: 0,
        end: 0,
      }),
      frameRate: 4,
      repeat: -1,
    });
  }

  private configCamera() {
    const zoom = this.scale.width < 800 ? 1 : 1.2;
    this.cameras.main.setZoom(zoom);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setFollowOffset(0, 45);
    this.cameras.main.setDeadzone(0, 50);
  }

  private createMobileControls() {
    const mkBtn = (
      x: number,
      y: number,
      key: string,
      onDown: () => void,
      onUp: () => void
    ) => {
      const btn = this.add
        .image(x, y, key)
        .setInteractive()
        .setScrollFactor(0)
        .setDisplaySize(32, 32);
      btn.on("pointerdown", onDown);
      btn.on("pointerup", onUp);
      btn.on("pointerout", onUp);
      btn.on("pointerover", onDown);
    };
    mkBtn(
      80,
      320,
      "btn_left",
      () => (this.leftPressed = true),
      () => (this.leftPressed = false)
    );
    mkBtn(
      160,
      320,
      "btn_right",
      () => (this.rightPressed = true),
      () => (this.rightPressed = false)
    );
    mkBtn(
      280,
      320,
      "btn_jump",
      () => (this.jumpPressed = true),
      () => (this.jumpPressed = false)
    );
  }

  private spawnBug(x: number, y: number) {
    const bug = this.physics.add.sprite(x, y, "bug").setScale(1);
    bug.setImmovable(true);
    bug.body.allowGravity = false;
    this.physics.add.overlap(this.player, bug, () => this.handlePlayerDeath());
  }

  private handlePlayerDeath() {
    this.player.setTint(0xff0000);
    this.player.anims.pause();
    this.time.delayedCall(1000, () => this.scene.restart());
  }
}
