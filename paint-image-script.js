const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageUpload = document.getElementById("imageUpload");
const downloadBtn = document.getElementById("downloadBtn");

let isImageLoaded = false;

function adjustCanvas() {
  canvas.width = 16 * 20;
  canvas.height = 16 * 20;
}

function loadImage(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      isImageLoaded = true;
    };
  };
  reader.readAsDataURL(file);
}

imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) loadImage(file);
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "pixel-paint-export.png";
  link.href = canvas.toDataURL();
  link.click();
});

adjustCanvas();
