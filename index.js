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

    if (text.trim()) {
        const textWidth = ctx.measureText(text).width;
        const textX = (canvas.width / 2) - (textWidth / 2); // Center text
        const textY = (canvas.height / 2) + (fontSize / 2); // Center text vertically

        textObjects.push({ text, x: textX, y: textY, fontSize, fontStyle });
        redraw();
        adjustCanvasSize(textX + textWidth, textY + fontSize); // Adjust canvas size
        textInput.value = '';
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
function adjustCanvasSize(newWidth, newHeight) {
    const currentWidth = canvas.width;
    const currentHeight = canvas.height;

    // If new size is larger, resize canvas
    if (newWidth > currentWidth || newHeight > currentHeight) {
        canvas.width = Math.max(newWidth, currentWidth);
        canvas.height = Math.max(newHeight, currentHeight);
    }
}

// Text moving functionality
let selectedTextIndex = null;

canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX - 70; // Adjust for toolbar
    const mouseY = e.clientY;

    // Check if a text object is clicked
    textObjects.forEach((textObj, index) => {
        ctx.font = `${textObj.fontSize}px ${textObj.fontStyle}`;
        const textWidth = ctx.measureText(textObj.text).width;

        if (mouseX >= textObj.x && mouseX <= textObj.x + textWidth &&
            mouseY >= textObj.y - textObj.fontSize && mouseY <= textObj.y) {
            selectedTextIndex = index; // Set selected text index
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (selectedTextIndex !== null) {
        const mouseX = e.clientX - 70; // Adjust for toolbar
        const mouseY = e.clientY;

        // Update position of the selected text object
        textObjects[selectedTextIndex].x = mouseX - (ctx.measureText(textObjects[selectedTextIndex].text).width / 2);
        textObjects[selectedTextIndex].y = mouseY;

        redraw(); // Redraw text with new position
        adjustCanvasSize(textObjects[selectedTextIndex].x + ctx.measureText(textObjects[selectedTextIndex].text).width, textObjects[selectedTextIndex].y + parseInt(textObjects[selectedTextIndex].fontSize)); // Adjust canvas size
    }
});

// Mouseup event to release selected text
canvas.addEventListener('mouseup', () => {
    selectedTextIndex = null; // Deselect text
});
