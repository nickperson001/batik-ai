// ============================
// Konva Stage & Layer Setup
// ============================
const container = document.getElementById("container");
const stage = new Konva.Stage({
  container: "container",
  width: container.offsetWidth,
  height: container.offsetHeight,
});
const drawLayer = new Konva.Layer();
stage.add(drawLayer);

// ============================
// Responsive Stage
// ============================
function resizeStage() {
  stage.width(container.offsetWidth);
  stage.height(container.offsetHeight);
  stage.batchDraw();
}
window.addEventListener("resize", resizeStage);

// ============================
// Global State
// ============================
let currentTool = "brush";
let isDrawing = false;
let brushSize = 12;
let brushOpacity = 1.0;
let currentColor = "#8b4513";
let stampSize = 150;
let undoStack = [];
let redoStack = [];

// ============================
// Helper Functions
// ============================
function saveHistory() {
  undoStack.push(stage.toJSON());
  redoStack = [];
}

function updateLayersList() {
  const list = document.getElementById("layers-list");
  if (!list) return;
  list.innerHTML = "";
  drawLayer.getChildren().forEach((node, i) => {
    const div = document.createElement("div");
    div.textContent = `${node.getClassName()} #${i}`;
    div.className =
      "px-2 py-1 bg-gray-100 rounded text-sm flex justify-between items-center";
    list.appendChild(div);
  });
}

// ============================
// Drawing Tools
// ============================
function startDrawing(pos) {
  if (["brush", "pencil", "eraser"].includes(currentTool)) {
    isDrawing = true;
    const line = new Konva.Line({
      stroke: currentTool === "eraser" ? "#fff" : currentColor,
      strokeWidth: brushSize,
      opacity: brushOpacity,
      globalCompositeOperation: currentTool === "eraser" ? "destination-out" : "source-over",
      points: [pos.x, pos.y],
      lineCap: "round",
      lineJoin: "round",
    });
    drawLayer.add(line);
    saveHistory();
  } else if (currentTool === "wax") {
    isDrawing = true;
    const wax = new Konva.Line({
      stroke: "rgba(255,255,255,0.6)",
      strokeWidth: brushSize,
      globalCompositeOperation: "destination-out",
      points: [pos.x, pos.y],
      lineCap: "round",
      lineJoin: "round",
    });
    drawLayer.add(wax);
    saveHistory();
  }
}

function keepDrawing(pos) {
  if (!isDrawing) return;
  const shape = drawLayer.getChildren().slice(-1)[0];
  const points = shape.points().concat([pos.x, pos.y]);
  shape.points(points);
  drawLayer.batchDraw();
}

function stopDrawing() {
  isDrawing = false;
}

// ============================
// Stamp Tool
// ============================
function addStamp(imgUrl, x, y) {
  if (!imgUrl) return;
  Konva.Image.fromURL(imgUrl, function (img) {
    img.setAttrs({
      x: x - stampSize / 2,
      y: y - stampSize / 2,
      width: stampSize,
      height: stampSize,
      draggable: true,
    });
    drawLayer.add(img);
    drawLayer.draw();
    saveHistory();
    updateLayersList();
  });
}

// ============================
// Stage Events (Mouse + Touch)
// ============================
function getPos(e) {
  const pos = stage.getPointerPosition();
  return pos;
}

stage.on("mousedown touchstart", (e) => {
  const pos = getPos(e);
  if (currentTool === "stamp") {
    const stampUrl = document.getElementById("stamp-select").value;
    addStamp(stampUrl, pos.x, pos.y);
  } else if (["brush", "pencil", "eraser", "wax"].includes(currentTool)) {
    startDrawing(pos);
  }
});

stage.on("mousemove touchmove", (e) => {
  const pos = getPos(e);
  keepDrawing(pos);
});

stage.on("mouseup touchend", stopDrawing);

// ============================
// UI Listeners
// ============================
document.getElementById("tool-select").addEventListener("change", (e) => {
  currentTool = e.target.value;
});

document.getElementById("brush-size").addEventListener("input", (e) => {
  brushSize = parseInt(e.target.value, 10);
  document.getElementById("brush-size-label").textContent = brushSize;
});

document.getElementById("brush-opacity").addEventListener("input", (e) => {
  brushOpacity = parseFloat(e.target.value);
  document.getElementById("brush-opacity-label").textContent = brushOpacity.toFixed(1);
});

document.getElementById("color-picker").addEventListener("input", (e) => {
  currentColor = e.target.value;
});

document.querySelectorAll(".palet-color").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentColor = btn.dataset.color;
    document.getElementById("color-picker").value = currentColor;
  });
});

document.getElementById("palette-toggle").addEventListener("click", () => {
  document.getElementById("palet-batik").classList.toggle("hidden");
});

// Stamp size
document.getElementById("stamp-size-up").addEventListener("click", () => {
  stampSize += 20;
  document.getElementById("stamp-size-label").textContent = `${stampSize}px`;
});
document.getElementById("stamp-size-down").addEventListener("click", () => {
  stampSize = Math.max(50, stampSize - 20);
  document.getElementById("stamp-size-label").textContent = `${stampSize}px`;
});

// Undo/Redo
document.getElementById("undo-btn").addEventListener("click", () => {
  if (!undoStack.length) return;
  const last = undoStack.pop();
  redoStack.push(stage.toJSON());
  stage.destroyChildren();
  Konva.Node.create(last, stage);
  drawLayer.draw();
  updateLayersList();
});
document.getElementById("redo-btn").addEventListener("click", () => {
  if (!redoStack.length) return;
  const last = redoStack.pop();
  undoStack.push(stage.toJSON());
  stage.destroyChildren();
  Konva.Node.create(last, stage);
  drawLayer.draw();
  updateLayersList();
});

// Zoom
document.getElementById("zoom-in").addEventListener("click", () => {
  stage.scale({ x: stage.scaleX() * 1.2, y: stage.scaleY() * 1.2 });
  stage.batchDraw();
});
document.getElementById("zoom-out").addEventListener("click", () => {
  stage.scale({ x: stage.scaleX() * 0.8, y: stage.scaleY() * 0.8 });
  stage.batchDraw();
});
document.getElementById("reset-view").addEventListener("click", () => {
  stage.scale({ x: 1, y: 1 });
  stage.position({ x: 0, y: 0 });
  stage.batchDraw();
});

// Upload gambar
document.getElementById("file-upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    Konva.Image.fromURL(ev.target.result, function (img) {
      img.setAttrs({ x: 50, y: 50, draggable: true });
      drawLayer.add(img);
      drawLayer.draw();
      saveHistory();
      updateLayersList();
    });
  };
  reader.readAsDataURL(file);
});

// Grid toggle
let gridVisible = false;
let gridLayer = null;
document.getElementById("add-guides").addEventListener("click", () => {
  if (gridVisible) {
    if (gridLayer) gridLayer.destroy();
    gridVisible = false;
  } else {
    gridLayer = new Konva.Layer();
    const step = 50;
    for (let i = 0; i < stage.width(); i += step) {
      gridLayer.add(new Konva.Line({ points: [i, 0, i, stage.height()], stroke: "#ddd" }));
    }
    for (let j = 0; j < stage.height(); j += step) {
      gridLayer.add(new Konva.Line({ points: [0, j, stage.width(), j], stroke: "#ddd" }));
    }
    stage.add(gridLayer);
    gridVisible = true;
  }
  stage.batchDraw();
});

// Clear canvas
document.getElementById("clear-canvas").addEventListener("click", () => {
  drawLayer.destroyChildren();
  undoStack = [];
  redoStack = [];
  updateLayersList();
  drawLayer.draw();
});

// Export PNG / JPG / Tile
document.getElementById("export-png").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "batik.png";
  link.href = stage.toDataURL({ mimeType: "image/png" });
  link.click();
});
document.getElementById("export-jpg").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "batik.jpg";
  link.href = stage.toDataURL({ mimeType: "image/jpeg", quality: 0.9 });
  link.click();
});
document.getElementById("export-tile").addEventListener("click", () => {
  const dataURL = stage.toDataURL({
    pixelRatio: 2,
    x: 0,
    y: 0,
    width: stage.width() / 2,
    height: stage.height() / 2,
  });
  const link = document.createElement("a");
  link.download = "batik-tile.png";
  link.href = dataURL;
  link.click();
});
