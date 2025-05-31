import React, { useRef, useLayoutEffect } from "react";
import Phaser from "phaser";
import MainScene from "../scenes/mainScene";
import StartScene from "../scenes/startScene";

function getGameDimensions() {
  const isMobile = window.innerWidth < 800;
  return {
    width: isMobile ? window.innerWidth - 30 : 800,
    height: isMobile ? Math.min(400, window.innerHeight) : 400,
  };
}

const usePhaserGame = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  useLayoutEffect(() => {
    if (!containerRef?.current) return;

    let game: Phaser.Game | null = null;

    const { width, height } = getGameDimensions();

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width,
      height,
      backgroundColor: "#E3E9FF",
      parent: containerRef?.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 600, x: 0 },
          debug: false,
        },
      },
      scene: [StartScene, MainScene],
    };

    game = new Phaser.Game(config);

    function handleResize() {
      const { width: newWidth, height: newHeight } = getGameDimensions();
      game?.scale.resize(newWidth, newHeight);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      game?.destroy(true);
    };
  }, [containerRef]);
};

const GameCanvas: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  usePhaserGame(gameRef);

  return (
    <div
      ref={gameRef}
      className="rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
      role="region"
      aria-label="Mini game 2D: Ajude a salvar o React do bug!"
      tabIndex={0}
      style={{
        outline: "none",
      }}
    />
  );
};

export default GameCanvas;
