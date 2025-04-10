const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const exportBtn = document.getElementById("exportBtn");

let currentColor = "#000000";
let isDrawing = false;
let cellSize = 20;
let gridSize = 16;

let history = [];
let redoStack = [];

function resizeCanvas() {
  canvas.width = gridSize * cellSize;
  canvas.height = gridSize * cellSize;
}

function drawGrid() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#e5e7eb";
  for (let x = 0; x <= canvas.width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function getCellCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  return { x, y };
}

function drawPixel(x, y) {
  ctx.fillStyle = currentColor;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function saveHistory() {
  history.push(canvas.toDataURL());
}

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const { x, y } = getCellCoordinates(e);
  drawPixel(x, y);
  saveHistory();
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const { x, y } = getCellCoordinates(e);
  drawPixel(x, y);
});

canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseleave", () => (isDrawing = false));

undoBtn.addEventListener("click", () => {
  if (history.length > 1) {
    redoStack.push(history.pop());
    const previousState = history[history.length - 1];
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
});

redoBtn.addEventListener("click", () => {
  if (redoStack.length > 0) {
    const redoState = redoStack.pop();
    history.push(redoState);
    const img = new Image();
    img.src = redoState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
});

exportBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "pixel-paint.png";
  link.href = canvas.toDataURL();
  link.click();
});

resizeCanvas();
drawGrid();
