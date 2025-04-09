"use client";

import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";

type Brick = {
  x: number;
  y: number;
  status: number;
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);

  const mintScoreNFT = async () => {
    if (hasMinted) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0x9bc83E8A3255436f59943bB09A2f15925B477040",
        ["function mint() public"],
        signer
      );
      const tx = await contract.mint();
      await tx.wait();
      setHasMinted(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 500;
    const canvasHeight = 340;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let ballX = canvasWidth / 2;
    let ballY = canvasHeight - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 8;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvasWidth - paddleWidth) / 2;

    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 3;
    const brickColumnCount = 7;
    const brickWidth = 55;
    const brickHeight = 15;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 35;

    let bricks: Brick[][] = [];

    const initializeBricks = () => {
      bricks = [];
      for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
    };

    initializeBricks();

    const ballImage = new Image();
    ballImage.src = "/ball.png";

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            b.x = brickX;
            b.y = brickY;
            ctx.fillStyle = "#00D8FF";
            ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
          }
        }
      }
    }

    function drawBall() {
      if (ballImage.complete) {
        ctx.drawImage(ballImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
      } else {
        ballImage.onload = () => {
          ctx.drawImage(ballImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
        };
      }
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddleX, canvasHeight - paddleHeight - 5, paddleWidth, paddleHeight);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    }

    function drawLogo() {
      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#00D8FF";
      ctx.textAlign = "center";
      ctx.fillText("BaseBall", canvasWidth / 2, canvasHeight / 2 + 20);
    }

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              ballX > b.x &&
              ballX < b.x + brickWidth &&
              ballY > b.y &&
              ballY < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              checkWin();
            }
          }
        }
      }
    }

    function checkWin() {
      const allCleared = bricks.every(column => column.every(b => b.status === 0));
      if (allCleared) {
        setShowWinMessage(true);
        setTimeout(() => {
          mintScoreNFT();
        }, 1500);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      gradient.addColorStop(0, "#1e1e4e");
      gradient.addColorStop(1, "#2c2c64");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      drawBricks();
      drawBall();
      drawPaddle();
      drawLogo();
      collisionDetection();

      if (ballX + dx > canvasWidth - ballRadius || ballX + dx < ballRadius) dx = -dx;
      if (ballY + dy < ballRadius) dy = -dy;
      else if (ballY + dy > canvasHeight - ballRadius - paddleHeight) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
          dy = -dy;
        } else if (ballY + dy > canvasHeight) {
          ballX = canvasWidth / 2;
          ballY = canvasHeight - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvasWidth - paddleWidth) / 2;
          initializeBricks();
        }
      }

      ballX += dx;
      ballY += dy;

      if (rightPressed && paddleX < canvasWidth - paddleWidth) paddleX += 5;
      if (leftPressed && paddleX > 0) paddleX -= 5;

      requestAnimationFrame(draw);
    }

    document.addEventListener("keydown", e => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    });

    document.addEventListener("keyup", e => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    });

    draw();
  }, []);

  return (
    <div style={{
      backgroundImage: "url('/BaseBall.png')",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      width: "680px",
      height: "460px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto",
      position: "relative"
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "500px",
          height: "340px"
        }}
      />
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
          textAlign: "center"
        }}>
          🎉 YOU WIN 🎉<br />
          🏆 NFT en cours de mint…
        </div>
      )}
    </div>
  );
}
