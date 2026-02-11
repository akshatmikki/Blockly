// lib/turtleEngine.ts
// Canvas-based Turtle Engine (Browser-safe)

export type TurtleShape = "turtle" | "circle" | "square" | "triangle";

export function createTurtle(canvasId: string = "turtleCanvas") {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Canvas with id '${canvasId}' not found`);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to get 2D canvas context");
  }

  /* =====================
     TURTLE STATE
  ===================== */
  let x = canvas.width / 2;
  let y = canvas.height / 2;
  let angle = 0;

  let penDown = true;
  let visible = false; // 🔥 HIDDEN BY DEFAULT

  let penColor = "#000000";
  let fillColor = "#00aa00";
  let lineWidth = 2;

  let shape: TurtleShape = "turtle";
  const turtleSize = 14;

  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  /* =====================
     DRAW TURTLE CURSOR
  ===================== */
  const drawTurtle = () => {
    if (!visible) return; // 🚫 do not draw unless visible

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(toRadians(angle));
    ctx.lineWidth = 2;
    ctx.strokeStyle = penColor;
    ctx.fillStyle = penColor;

    switch (shape) {
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, turtleSize, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "square":
        ctx.fillRect(
          -turtleSize,
          -turtleSize,
          turtleSize * 2,
          turtleSize * 2
        );
        break;

      case "triangle":
        ctx.beginPath();
        ctx.moveTo(0, -turtleSize);
        ctx.lineTo(turtleSize, turtleSize);
        ctx.lineTo(-turtleSize, turtleSize);
        ctx.closePath();
        ctx.fill();
        break;

      default: // turtle
        ctx.beginPath();
        ctx.moveTo(0, -turtleSize);
        ctx.lineTo(turtleSize * 0.8, turtleSize);
        ctx.lineTo(-turtleSize * 0.8, turtleSize);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.restore();
  };

  /* =====================
     PUBLIC API
  ===================== */
  const turtle = {
    reset() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      x = canvas.width / 2;
      y = canvas.height / 2;
      angle = 0;
      penDown = true;
      visible = false; // hide on reset
    },

    /* ===== Visibility ===== */
    showturtle() {
      visible = true;
      drawTurtle();
    },

    hideturtle() {
      visible = false;
    },

    /* ===== Shape ===== */
    setShape(newShape: TurtleShape) {
      shape = newShape;
       visible = true; 
    },

    /* ===== Drawing ===== */
    bgcolor(color: string) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      drawTurtle();
    },

    forward(distance: number) {
      const nx = x + Math.cos(toRadians(angle)) * distance;
      const ny = y + Math.sin(toRadians(angle)) * distance;

      if (penDown) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      x = nx;
      y = ny;
      drawTurtle(); // cursor only if visible
    },

    right(deg: number) {
      angle += deg;
      drawTurtle();
    },

    left(deg: number) {
      angle -= deg;
      drawTurtle();
    },

    penup() {
      penDown = false;
    },

    pendown() {
      penDown = true;
    },

    pencolor(color: string) {
      penColor = color;
    },

    width(w: number) {
      lineWidth = w;
    },

    dot(radius: number) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
      drawTurtle();
    },

    fillcolor(color: string) {
      fillColor = color;
    }
  };

  return turtle;
}
