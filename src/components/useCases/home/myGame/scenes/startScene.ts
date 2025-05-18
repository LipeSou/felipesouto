export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    const { width, height } = this.scale;

    // Background e borda
    this.cameras.main.setBackgroundColor("#FFFFFF");
    const graphics = this.add.graphics().setScrollFactor(0);
    graphics.lineStyle(0.5, 0x0f0602);
    graphics.strokeRoundedRect(0, 0, width, height, 12);

    // this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);
    this.add
      .text(
        width / 2,
        height / 2 - 40,
        "Me ajude a salvar o mundo do Bug que raptou o React!",
        {
          fontSize: "20px",
          color: "#0f0602",
          align: "center",
          wordWrap: { width: width - 60 },
        }
      )
      .setOrigin(0.5);

    const btn = this.add
      .text(width / 2, height / 2 + 30, "Jogar", {
        fontSize: "28px",
        color: "#F5FAFF",
        backgroundColor: "#167C80",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    btn.on("pointerdown", () => {
      this.scene.start("MainScene"); // inicia o jogo real
    });
  }
}
