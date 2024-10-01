const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');

// Set initial canvas size
canvas.width = window.innerWidth - 70; // Account for toolbar width
canvas.height = window.innerHeight;

let isPainting = false;
let lineWidth = 5;
ctx.strokeStyle = '#000000';

const textObjects = [];

// Clear canvas
document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    textObjects.length = 0; // Clear text objects
});

// Update stroke color and line width
document.getElementById('stroke').addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
});
document.getElementById('lineWidth').addEventListener('change', (e) => {
    lineWidth = e.target.value;
});

// Drawing functionality
canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - 70, e.clientY); // Adjust for toolbar
});

canvas.addEventListener('mouseup', () => {
    isPainting = false;
    ctx.closePath();
    adjustCanvasSize(); // Check if the canvas needs to expand
});

canvas.addEventListener('mousemove', (e) => {
    if (!isPainting) return;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - 70, e.clientY);
    ctx.stroke();
});

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 70; // Update canvas width
    canvas.height = window.innerHeight; // Update canvas height
    redraw(); // Redraw content on resize
});

// Text adding functionality
const textInput = document.getElementById('textInput');
const addTextButton = document.getElementById('addText');
const fontSizeInput = document.getElementById('fontSize');
const fontStyleSelect = document.getElementById('fontStyle');

addTextButton.addEventListener('click', () => {
    const text = textInput.value;
    const fontSize = fontSizeInput.value;
    const fontStyle = fontStyleSelect.value;

    const textX = (canvas.width / 2) - (ctx.measureText(text).width / 2); // Center text
    const textY = (canvas.height / 2) + (fontSize / 2); // Center text vertically

    if (text.trim()) {
        textObjects.push({ text, x: textX, y: textY, fontSize, fontStyle });
        redraw();
        textInput.value = '';
        adjustCanvasSize(); // Check if the canvas needs to expand
    }
});

// Redraw text and drawings
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing

    // Redraw all text objects
    textObjects.forEach(({ text, x, y, fontSize, fontStyle }) => {
        ctx.font = `${fontSize}px ${fontStyle}`;
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillText(text, x, y);
    });
}

// Adjust canvas size based on content
function adjustCanvasSize() {
    let maxX = canvas.width;
    let maxY = canvas.height;

    // Check text objects for boundaries
    textObjects.forEach(({ x, y, fontSize }) => {
        const textWidth = ctx.measureText(text).width;
        if (x + textWidth > maxX) maxX = x + textWidth;
        if (y + fontSize > maxY) maxY = y + fontSize;
    });

    // Expand canvas if necessary
    if (maxX > canvas.width || maxY > canvas.height) {
        canvas.width = Math.max(maxX, canvas.width);
        canvas.height = Math.max(maxY, canvas.height);
    }
}
