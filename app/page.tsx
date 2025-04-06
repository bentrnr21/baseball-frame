"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showWinMessage, setShowWinMessage] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Raquette
    let paddleX = canvas.width / 2 - 40;
    const paddleWidth = 80;
    const paddleHeight = 10;

    // Balle
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 8;

    // Briques
    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 60;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 35;

    const bricks: { x: number; y: number; status: number }[][] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    // Mouvement souris
    function mouseMoveHandler(e: MouseEvent) {
      const relativeX = e.clientX - canvas.getBoundingClientRect().left;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    }

    document.addEventListener("mousemove", mouseMoveHandler);

    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#00D8FF"; // Base logo color
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#00D8FF";
      ctx.fill();
      ctx.closePath();
    }

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#fff";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;

              const allBricksCleared = bricks.every(column =>
                column.every(b => b.status === 0)
              );

              if (allBricksCleared) {
                setShowWinMessage(true);
              }
            }
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      // rebond mur
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
      if (y + dy < ballRadius) dy = -dy;
      else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          document.removeEventListener("mousemove", mouseMoveHandler);
        }
      }

      x += dx;
      y += dy;
      requestAnimationFrame(draw);
    }

    draw();

    return () => document.removeEventListener("mousemove", mouseMoveHandler);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <canvas
        ref={canvasRef}
        width="400"
        height="300"
        style={{ background: "#000", border: "2px solid #00D8FF" }}
      ></canvas>

      {showWinMessage && (
        <div
          style={{
            marginTop: "20px",
            color: "#00D8FF",
            fontFamily: "monospace",
            fontSize: "20px",
          }}
        >
          🎉 YOU WIN <br />
          🧱 Mint en cours…
        </div>
      )}
    </div>
  );
}
