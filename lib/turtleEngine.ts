// lib/turtleEngine.ts
// Canvas-based Turtle Engine (Browser-safe)

export function createTurtle(canvasId: string = "turtleCanvas") {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

  if (!canvas) {
    throw new Error(`Canvas with id '${canvasId}' not found`);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to get 2D canvas context");
  }

  let x = canvas.width / 2;
  let y = canvas.height / 2;
  let angle = 0;
  let penDown = true;

  let penColor = "#000000";
  let fillColor = "#00aa00";
  let lineWidth = 2;

  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  return {
    reset() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      x = canvas.width / 2;
      y = canvas.height / 2;
      angle = 0;
      penDown = true;
    },

    bgcolor(color: string) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    forward(distance: number) {
      const nx = x + Math.cos(toRadians(angleogangle)) * distance;
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
    },

    right(deg: number) {
      angle += deg;
    },

    left(deg: number) {
      angle -= deg;
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
    },

    fillcolor(color: string) {
      fillColor = color;
    },
  };
}
