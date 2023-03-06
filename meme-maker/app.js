const lineWidth = document.querySelector("#line-width");
const color = document.querySelector("#color");
const colorOptions = Array.from(
    document.getElementsByClassName("color-option")
);
const modeBtn = document.querySelector("#mode-btn");
const destroyBtn = document.querySelector("#destroy-btn");
const eraseBtn = document.querySelector("#eraser-btn");
const fileInput = document.querySelector("#file");
const textInput = document.querySelector("#text");
const saveBtn = document.querySelector("#save");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); // 캔버스에 그림을 그리기 위한 붓
canvas.width = 800;
canvas.height = 800;

ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

let isPainting = false;
let isFilling = false;

function onMove(event) {
    if (isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
    isPainting = true;
}

function cancelPainting() {
    isPainting = false;
    ctx.beginPath();
}

function onLineWidthChange(event) {
    ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
    let newColor;
    if (event.target.value !== undefined) {
        // input에서 선택
        newColor = event.target.value;
    } else {
        // span에서 선택(색깔 보기들 중 선택)
        newColor = event.target.dataset.color;
        color.value = newColor;
    }

    ctx.strokeStyle = newColor;
    ctx.fillStyle = newColor;
}

function onModeClick() {
    if (isFilling) {
        isFilling = false;
        modeBtn.innerText = "Fill";
    } else {
        isFilling = true;
        modeBtn.innerText = "Draw";
    }
}

function onCanvasClick() {
    if (isFilling) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function onDestroyClick() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function onEraserClick() {
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
}

function onFileChange(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file); // 선택한 파일을 가리키는 url
    const image = new Image();
    image.src = url;
    image.onload = function () {
        // 이벤트 등록의 다른방법
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        fileInput.value = null; // 사진 선택 후, 다른 사진 선택을 위해 비워두기
    };
}

function onDoubleClick(event) {
    const text = textInput.value;
    if (text !== "") {
        ctx.save(); // ctx의 현재 상태를 저장
        ctx.lineWidth = 1;
        ctx.font = "48px bold serif";
        ctx.fillText(text, event.offsetX, event.offsetY);
        ctx.restore(); // 아까 저장해둔 상태로 되돌림
    }
}

function onSaveClick(event) {
    const url = canvas.toDataURL(); // 캔버스의 이미지를 나타내는 url
    const a = document.createElement("a"); // 이미지 다운로드를 위한 a 태그
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
canvas.addEventListener("dblclick", onDoubleClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);
colorOptions.forEach((color) => color.addEventListener("click", onColorChange));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraseBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
