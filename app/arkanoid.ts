// 🔁 CODE ORIGINAL DE arkanoid.ts (version fonctionnelle GameBoy)

import { useEffect } from "react";

export function useArkanoid(canvasId: string) {
  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let ballX = 160;
    let ballY = 240;
    let dx = 2;
    let dy = -2;
    let paddleX = 120;
    const paddleWidth = 60;
    const paddleHeight = 10;
    const ballSize = 20;

    const ballImg = new Image();
    ballImg.src = "/ball.png";

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#0f0c29");
      gradient.addColorStop(0.5, "#302b63");
      gradient.addColorStop(1, "#24243e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(ballImg, ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);

      ballX += dx;
      ballY += dy;

      if (ballX + dx > canvas.width - ballSize / 2 || ballX + dx < ballSize / 2) dx = -dx;
      if (ballY + dy < ballSize / 2) dy = -dy;

      if (
        ballY + dy > canvas.height - paddleHeight - 10 - ballSize / 2 &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth
      ) {
        dy = -dy;
      }

      if (ballY + dy > canvas.height - ballSize / 2) {
        ballX = 160;
        ballY = 240;
        dx = 2;
        dy = -2;
      }

      requestAnimationFrame(draw);
    };

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && paddleX < canvas.width - paddleWidth) {
        paddleX += 20;
      } else if (e.key === "ArrowLeft" && paddleX > 0) {
        paddleX -= 20;
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [canvasId]);
}
