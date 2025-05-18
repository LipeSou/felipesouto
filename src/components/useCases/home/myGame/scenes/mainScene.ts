import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private leftPressed = false;
  private rightPressed = false;
  private jumpPressed = false;

  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.spritesheet(
      "player_idle",
      import.meta.env.BASE_URL + "assets/PlayerIdle.png",
      {
        frameWidth: 48,
        frameHeight: 48,
      }
    );
    this.load.spritesheet(
      "player_run",
      import.meta.env.BASE_URL + "assets/PlayerRun.png",
      {
        frameWidth: 48,
        frameHeight: 48,
      }
    );
    this.load.spritesheet(
      "player_jump",
      import.meta.env.BASE_URL + "assets/PlayerJump.png",
      {
        frameWidth: 48,
        frameHeight: 48,
      }
    );
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
  }

  create() {
    const isMobile =
      this.sys.game.device.os.android || this.sys.game.device.os.iOS;

    // permite dois toques simultâneos
    this.input.addPointer(2);
    this.input.mouse?.disableContextMenu();

    // Captura as teclas do teclado
    if (this.input?.keyboard?.createCursorKeys) {
      this.cursors = this.input?.keyboard?.createCursorKeys();
    }

    // Cria o chão
    const ground = this.physics.add.staticGroup();
    ground.create(400, 580, "ground").setScale(2).refreshBody();

    // Cria o jogador
    this.player = this.physics.add.sprite(100, 300, "player_idle");
    this.player.setOrigin(0.5, 1);
    this.player.setBounce(0.2); // faz ele "quicar" um pouco

    // Define os limites do mundo
    this.physics.world.setBounds(0, 0, 1600, 600);
    this.cameras.main.setBounds(0, 0, 1600, 600);

    this.player.setCollideWorldBounds(true); // impede de sair da tela
    this.player.setOffset(0, -8);

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player_idle", {
        start: 0,
        end: 9,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player_run", {
        start: 0,
        end: 7,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player_jump", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
    });

    // Aplica o zoom da câmera
    const screenW = this.scale.width;
    const zoom = screenW < 800 ? 1.2 : 1.6;

    this.cameras.main.setZoom(zoom);

    // Foca a câmera no personagem
    this.cameras.main.startFollow(this.player);

    // Define limites da câmera se necessário
    // this.cameras.main.setBounds(0, 0, larguraTotalDoMapa, alturaTotalDoMapa);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setFollowOffset(0, 45); // move a câmera 100px para cima

    this.cameras.main.setDeadzone(0, 50); // tolerância vertical

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.play("run", true);
      this.player.setFlipX(true); // vira o sprite para a esquerda
    }
    // Movimento para a direita
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.play("run", true);
      this.player.setFlipX(false);
    }
    // Parado
    else {
      this.player.setVelocityX(0);
      this.player.play("idle", true);
    }

    // Adiciona colisão com o chão
    this.physics.add.collider(this.player, ground);

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") e.preventDefault();
    });

    if (isMobile) {
      // cria botões mobile
      const btnLeft = this.add
        .image(80, 320, "btn_left")
        .setInteractive()
        .setScrollFactor(0)
        .setDisplaySize(32, 32);
      const btnRight = this.add
        .image(160, 320, "btn_right")
        .setInteractive()
        .setScrollFactor(0)
        .setDisplaySize(32, 32);
      const btnJump = this.add
        .image(280, 320, "btn_jump")
        .setInteractive()
        .setScrollFactor(0)
        .setDisplaySize(32, 32);

      btnLeft.on("pointerdown", () => (this.leftPressed = true));
      btnLeft.on("pointerup", () => (this.leftPressed = false));
      btnLeft.on("pointerout", () => (this.leftPressed = false));
      btnLeft.on("pointerover", () => (this.leftPressed = true));

      btnRight.on("pointerdown", () => (this.rightPressed = true));
      btnRight.on("pointerup", () => (this.rightPressed = false));
      btnRight.on("pointerout", () => (this.rightPressed = false));
      btnRight.on("pointerover", () => (this.rightPressed = true));

      btnJump.on("pointerdown", () => (this.jumpPressed = true));
      btnJump.on("pointerup", () => (this.jumpPressed = false));
      btnJump.on("pointerout", () => (this.jumpPressed = false));
      btnJump.on("pointerover", () => (this.jumpPressed = true));
    }
  }

  update() {
    // movimentação, física, lógica de jogo
    if (!this.cursors) return;

    // Combina teclado e toque
    const moveLeft = this.cursors.left.isDown || this.leftPressed;
    const moveRight = this.cursors.right.isDown || this.rightPressed;
    const jump =
      this.cursors.up.isDown || this.cursors.space?.isDown || this.jumpPressed;

    const isTouchingGround = this.player.body?.touching.down;
    const isMoving = moveLeft || moveRight;

    // Pulo
    if (jump && isTouchingGround) {
      this.player.setVelocityY(-330);
    }

    // Animações
    if (!isTouchingGround) {
      this.player.play("jump", true);
    } else if (isMoving) {
      this.player.play("run", true);
    } else {
      this.player.play("idle", true);
    }

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
  }
}
