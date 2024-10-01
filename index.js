const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth - toolbar.offsetWidth;
canvas.height = window.innerHeight;

let isPainting = false;
let lineWidth = 5;
ctx.strokeStyle = '#000000';

let textObjects = []; // Array to store text objects
let selectedTextIndex = null; // Index of the currently selected text object

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        textObjects = []; // Clear text objects
    }
});

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
    if (!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - toolbar.offsetWidth, e.clientY);
    ctx.stroke();
}

// Mouse event listeners for drawing
canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - toolbar.offsetWidth, e.clientY);
});

canvas.addEventListener('mouseup', () => {
    isPainting = false;
    ctx.closePath();
});

canvas.addEventListener('mousemove', draw);

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - toolbar.offsetWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawText(); // Redraw text on resize
});

// Text adding functionality
const textInput = document.getElementById('textInput');
const addTextButton = document.getElementById('addText');
const fontSizeInput = document.getElementById('fontSize');
const fontStyleSelect = document.getElementById('fontStyle');

// Function to add text on canvas
addTextButton.addEventListener('click', () => {
    const text = textInput.value;
    const fontSize = fontSizeInput.value;
    const fontStyle = fontStyleSelect.value;
    
    const textX = canvas.width / 2; // Default position
    const textY = canvas.height / 2; // Default position

    textObjects.push({ text, x: textX, y: textY, fontSize, fontStyle }); // Add text object
    redrawText(); // Redraw text
    textInput.value = ''; // Clear the input field
});

// Redraw text function
function redrawText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
    textObjects.forEach(({ text, x, y, fontSize, fontStyle }) => {
        ctx.font = `${fontSize}px ${fontStyle}`; // Set font size and style
        ctx.fillStyle = ctx.strokeStyle; // Use current stroke color for text
        ctx.fillText(text, x, y); // Draw the text
    });
}

// Text moving functionality
canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX - toolbar.offsetWidth;
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

// Mousemove event for dragging text
canvas.addEventListener('mousemove', (e) => {
    if (selectedTextIndex !== null) {
        const mouseX = e.clientX - toolbar.offsetWidth;
        const mouseY = e.clientY;

        // Update position of the selected text object
        textObjects[selectedTextIndex].x = mouseX;
        textObjects[selectedTextIndex].y = mouseY;
        redrawText(); // Redraw text with new position
    }
});

// Mouseup event to release selected text
canvas.addEventListener('mouseup', () => {
    selectedTextIndex = null; // Deselect text
});
