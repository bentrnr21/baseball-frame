"use client";

import { useEffect, useRef, useState } from "react";
import { createFrame } from "@coinbase/onchainkit";
import { contractAddress } from "../lib/contract";
import { encodeFunctionData } from "viem";
import { base } from "viem/chains";
import Image from "next/image";
import BaseBall from "public/BaseBall.png";
import Ball from "public/ball.png";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showWinMessage, setShowWinMessage] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 10;
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
    let bricks: any[][] = [];
    let bricksLeft = brickRowCount * brickColumnCount;

    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const drawBall = () => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.drawImage(Ball, x - ballRadius, y - ballRadius, 20, 20);
      ctx.closePath();
    };

    const drawPaddle = () => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#00D8FF";
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#00D8FF";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const collisionDetection = () => {
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
              bricksLeft--;
              if (bricksLeft === 0) {
                setShowWinMessage(true);
              }
            }
          }
        }
      }
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          document.location.reload();
        }
      }

      x += dx;
      y += dy;

      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      requestAnimationFrame(draw);
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
      }
    });

    draw();
  }, []);

  return (
    <div style={{
      backgroundColor: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}>
      <Image src={BaseBall} alt="Logo" width={200} height={80} style={{ marginBottom: "20px" }} />
      <canvas ref={canvasRef} width={480} height={320} style={{ border: "2px solid #00D8FF" }} />

      {showWinMessage && (
        <div style={{
          position: "absolute",
          top: "120px",
          backgroundColor: "black",
          color: "#00D8FF",
          padding: "20px",
          borderRadius: "15px",
          fontFamily: "monospace",
          fontSize: "20px",
          textAlign: "center",
        }}>
          🎉 YOU WIN 🎉<br />
          🧱 NFT en cours de mint…
        </div>
      )}
    </div>
  );
}
