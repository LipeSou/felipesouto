import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import MainScene from "../scenes/mainScene";
import StartScene from "../scenes/startScene";

const GameCanvas: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 800;

    const width = isMobile ? window.innerWidth - 30 : 800;
    const height = isMobile ? Math.min(400, window.innerHeight) : 400;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width,
      height,
      backgroundColor: "#E3E9FF",
      parent: gameRef.current ?? undefined,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 600, x: 0 },
          debug: false,
        },
      },
      scene: [StartScene, MainScene],
    };

    const game = new Phaser.Game(config);

    const resize = () => {
      const isMobile = window.innerWidth < 800;
      const newWidth = isMobile ? window.innerWidth : 800;
      const newHeight = isMobile ? Math.min(400, window.innerHeight) : 400;

      game.scale.resize(newWidth, newHeight);
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} />;
};

export default GameCanvas;
