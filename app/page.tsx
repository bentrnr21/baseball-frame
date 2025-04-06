"use client";

import { useEffect, useRef, useState } from "react";

type Brique = {
  x: number;
  y: number;
  status: number;
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [briques, setBriques] = useState<Brique[]>([]);
  const [showWinMessage, setShowWinMessage] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // Initialisation
    const ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let bricks: Brique[] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        bricks.push({
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          status: 1,
        });
      }
    }
    setBriques(bricks);

    const drawBall = () => {
      ctx.beginPath();
      const img = new Image();
      img.src = "/ball.png";
      ctx.drawImage(img, x - ballRadius, y - ballRadius, 20, 20);
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#00D8FF";
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      bricks.forEach((brick) => {
        if (brick.status === 1) {
          ctx.beginPath();
          ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
          ctx.fillStyle = "#00D8FF";
          ctx.fill();
          ctx.closePath();
        }
      });
    };

    const collisionDetection = () => {
      bricks.forEach((brick) => {
        if (brick.status === 1) {
          if (
            x > brick.x &&
            x < brick.x + brickWidth &&
            y > brick.y &&
            y < brick.y + brickHeight
          ) {
            dy = -dy;
            brick.status = 0;
            setBriques([...bricks]);
            if (bricks.every((b) => b.status === 0)) {
              setShowWinMessage(true);
              clearInterval(interval);
              // mint ici ?
            }
          }
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
      if (y + dy < ballRadius) dy = -dy;
      else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
        else document.location.reload();
      }

      x += dx;
      y += dy;

      if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
      else if (leftPressed && paddleX > 0) paddleX -= 7;
    };

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    const interval = setInterval(draw, 10);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <canvas
        ref={canvasRef}
        width={480}
        height={320}
        style={{ border: "2px solid #00D8FF", marginTop: "40px" }}
      />
      {showWinMessage && (
        <div
          style={{
            position: "absolute",
            top: "120px",
            backgroundColor: "black",
            color: "#00D8FF",
            padding: "20px",
            borderRadius: "15px",
            fontFamily: "monospace",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          🎉 YOU WIN 🎉<br />
          🏆 NFT en cours de mint…
        </div>
      )}
    </div>
  );
}
