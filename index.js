const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

let isPainting = false;
let isDragging = false;
let lineWidth = 5;
ctx.strokeStyle = '#000000';

let textObjects = [];
let selectedTextIndex = null;

let offsetX = 0;
let offsetY = 0;

// Clear the canvas
toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        textObjects = [];
    }
});

// Update stroke color and line width
toolbar.addEventListener('change', e => {
    if (e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }
    if (e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
});

// Drawing function
const draw = (e) => {
    if (!isPainting) return;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - toolbar.offsetWidth - offsetX, e.clientY - offsetY);
    ctx.stroke();
}

// Mouse event listeners for drawing
canvas.addEventListener('mousedown', (e) => {
    if (selectedTextIndex !== null) {
        isDragging = true;
    } else {
        isPainting = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX - toolbar.offsetWidth - offsetX, e.clientY - offsetY);
    }
});

canvas.addEventListener('mouseup', () => {
    isPainting = false;
    isDragging = false;
    ctx.closePath();
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        offsetX += e.movementX;
        offsetY += e.movementY;
        redraw();
    } else if (isPainting) {
        draw(e);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
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

    const textX = (canvas.width / 2) + offsetX; // Center text
    const textY = (canvas.height / 2) + offsetY; // Center text

    if (text.trim()) {
        textObjects.push({ text, x: textX, y: textY, fontSize, fontStyle });
        redraw();
        textInput.value = '';
    }
});

// Redraw text function
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
    ctx.save();
    ctx.translate(offsetX, offsetY); // Apply offsets

    // Redraw all text objects
    textObjects.forEach(({ text, x, y, fontSize, fontStyle }) => {
        ctx.font = `${fontSize}px ${fontStyle}`;
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillText(text, x, y);
    });

    ctx.restore();
}

// Text moving functionality
canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX - toolbar.offsetWidth - offsetX;
    const mouseY = e.clientY - offsetY;

    textObjects.forEach((textObj, index) => {
        ctx.font = `${textObj.fontSize}px ${textObj.fontStyle}`;
        const textWidth = ctx.measureText(textObj.text).width;

        if (mouseX >= textObj.x && mouseX <= textObj.x + textWidth &&
            mouseY >= textObj.y - textObj.fontSize && mouseY <= textObj.y) {
            selectedTextIndex = index;
        }
    });
});

// Mousemove event for dragging text
canvas.addEventListener('mousemove', (e) => {
    if (selectedTextIndex !== null) {
        const mouseX = e.clientX - toolbar.offsetWidth - offsetX;
        const mouseY = e.clientY - offsetY;

        textObjects[selectedTextIndex].x = mouseX;
        textObjects[selectedTextIndex].y = mouseY;
        redraw();
    }
});

// Mouseup event to release selected text
canvas.addEventListener('mouseup', () => {
    selectedTextIndex = null;
});
