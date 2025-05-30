export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    const { width, height } = this.scale;

    // Background e borda
    this.cameras.main.setBackgroundColor("#FFFFFF");

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
        backgroundColor: "#0070d1",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    btn.on("pointerdown", () => {
      this.scene.start("MainScene");
    });
  }
}
