import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import MainScene from "../scenes/mainScene";

const GameCanvas: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 400,
      backgroundColor: "#CCFFFF",
      parent: gameRef.current ?? undefined,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 600, x: 0 },
          debug: false,
        },
      },
      scene: [MainScene],
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} />;
};

export default GameCanvas;
