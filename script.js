const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const textInput = document.getElementById('textInput');
const colorDropdown = document.getElementById('colorDropdown');
const hexInput = document.getElementById('hexInput');
const resolutionDropdown = document.getElementById('resolutionDropdown');
const fontColorInput = document.getElementById('fontColorInput');
const fontDropdown = document.getElementById('fontDropdown');
const alignmentDropdown = document.getElementById('alignmentDropdown');
const fontSizeInput = document.getElementById('fontSizeInput');
const canvas = document.getElementById('textCanvas');
const ctx = canvas.getContext('2d');

const resolutions = {
    square: { width: 500, height: 500 },
    rectangle: { width: 600, height: 400 }
};

function wrapText(context, text, x, y, maxWidth, lineHeight, textAlign) {
    const lines = text.split('\n');
    lines.forEach((line) => {
        let words = line.split(' ');
        let currentLine = '';
        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && i > 0) {
                context.fillText(currentLine, x, y);
                currentLine = words[i] + ' ';
                y += lineHeight;
            } else {
                currentLine = testLine;
            }
        }
        context.fillText(currentLine, x, y);
        y += lineHeight;
    });
}

function calculateTextHeight(context, text, maxWidth, lineHeight) {
    const lines = text.split('\n');
    let totalHeight = 0;
    lines.forEach((line) => {
        let words = line.split(' ');
        let currentLine = '';
        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && i > 0) {
                totalHeight += lineHeight;
                currentLine = words[i] + ' ';
            } else {
                currentLine = testLine;
            }
        }
        totalHeight += lineHeight;
    });
    return totalHeight;
}

generateBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    let bgColor = colorDropdown.value;
    const hexColor = hexInput.value.trim();
    const selectedResolution = resolutionDropdown.value;
    const fontColor = fontColorInput.value;
    const fontStyle = fontDropdown.value;
    const textAlign = alignmentDropdown.value;
    const fontSize = fontSizeInput.value.trim() || '30';

    if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
        bgColor = hexColor;
    }

    const { width, height } = resolutions[selectedResolution];
    canvas.width = width;
    canvas.height = height;

    if (text) {
        // Set canvas background color to the selected color or hex code
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text properties
        ctx.fillStyle = fontColor;
        ctx.font = `${fontSize}px ${fontStyle}`;
        ctx.textBaseline = 'top';

        // Set text alignment
        ctx.textAlign = textAlign;

        // Determine X coordinate based on text alignment
        let x;
        if (textAlign === 'left') {
            x = 20; // Add some padding for left alignment
        } else if (textAlign === 'right') {
            x = canvas.width - 20; // Add padding for right alignment
        } else {
            x = canvas.width / 2; // Center alignment
        }

        // Calculate the height needed for the text
        const lineHeight = parseInt(fontSize) + 10;
        const textHeight = calculateTextHeight(ctx, text, canvas.width - 40, lineHeight);

        // Vertically center the text block
        const y = (canvas.height - textHeight) / 2;

        // Draw the wrapped text, centered vertically and aligned as specified
        wrapText(ctx, text, x, y, canvas.width - 40, lineHeight, textAlign);

        // Show the download button
        downloadBtn.style.display = 'block';
    }
});

downloadBtn.addEventListener('click', () => {
    const imageUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated_image.png';
    link.click();
});