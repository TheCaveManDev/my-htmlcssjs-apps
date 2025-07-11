const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');
const colorSelector = document.querySelector('.line-color-box');
const clearBtn = document.querySelector('.clear-btn');
const brushLineWidth = document.querySelector('.brush-line-width');
const brushProperties = document.querySelector('.brush-properties');
const toolbarBtns = document.querySelectorAll('.toolbar-btn:not(.clear-btn)');
const navBtn = document.querySelector('.nav-btn');
const navBar = document.querySelector('nav');
const canvasColor = document.querySelector('.canvas-color');
const gridColor = document.querySelector('.grid-color');

const brushColorText = document.querySelector('.brush-color-text');
const brushSizeText = document.querySelector('.brush-size-text');

const zoomLevel = document.querySelector('.zoom-level');

const brushCursor = document.querySelector('.brush-cursor');

const toolbar = document.querySelector('.toolbar');

const themeSelector = document.querySelector('.theme')

const navLabels = document.querySelectorAll('.nav-label');

function changeMode(mode) {
    if (mode == 'dark') {
        canvas.style.backgroundColor = 'var(--canvas-dark)';
        navBar.style.backgroundColor = 'var(--ui-color-dark)';
        toolbar.style.backgroundColor = 'var(--ui-color-dark)';
        ctx.strokeStyle = 'white';
        themeSelector.style.backgroundColor = 'var(--ui-color-dark)';
        themeSelector.style.color = 'var(--ui-text-color-dark)';
        navLabels.forEach(label => {
            label.style.color = 'var(--ui-text-color-dark)';
        }
        );
        document.documentElement.style.color = 'var(--ui-text-color-dark)';
    } else {
        canvas.style.backgroundColor = 'var(--canvas-light)';
        navBar.style.backgroundColor = 'var(--ui-color-light)';
        toolbar.style.backgroundColor = 'var(--ui-color-light)';
        ctx.strokeStyle = 'black';
        themeSelector.style.backgroundColor = 'var(--ui-color-light)';
        themeSelector.style.color = 'var(--ui-text-color-light)';
        navLabels.forEach(label => {
            label.style.color = 'var(--ui-text-color-light)';
        }
        );
        document.documentElement.style.color = 'var(--ui-text-color-light)';
    };
};

themeSelector.onchange = () => {
    changeMode(themeSelector.value)
};

changeMode(themeSelector.value);

let gridColorValue = gridColor.value;
brushColorText.textContent = gridColorValue;
brushSizeText.textContent = brushLineWidth.value;

gridColor.addEventListener('input', () => {
    gridColorValue = gridColor.value;
    draw();
})


canvas.color = canvasColor.value;

canvasColor.addEventListener('input', () => {
    canvas.style.backgroundColor = canvasColor.value;
})

navBtn.onclick = showNavBar;

function showNavBar() {
    navBtn.onclick = hideNavBar;
    navBar.style.translate = '0% 0%';

}

function hideNavBar() {
    navBtn.onclick = showNavBar;
    navBar.style.translate = '-100% 0%';

}

let drawingMode = 'free';  // Use same mode keys as data-drawmode attributes

let isShiftPressed = false;
window.addEventListener('keydown', e => {
    if (e.key === 'Shift') {
        isShiftPressed = true;
    }
});

window.addEventListener('keyup', e => {
    if (e.key === 'Shift') {
        isShiftPressed = false;
    }
});


toolbarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        toolbarBtns.forEach(b => b.classList.remove('activated'));
        activateBtn(btn);
    });
});

function activateBtn(btn) {
    btn.classList.add('activated');
    drawingMode = btn.getAttribute('data-drawmode');
}

function activateBtnByMode(mode) {
    toolbarBtns.forEach(btn => {
        btn.classList.remove('activated');
        if (btn.getAttribute('data-drawmode') === mode) {
            activateBtn(btn);
        }
    });
}

let isPanning = false;
let panStart = { x: 0, y: 0 };

let paths = [];
let currentPath = null;
let previewShape = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
});

function getAdaptiveSpacing(scale) {
    if (scale < 0.25) return 2000;
    if (scale < 0.2625) return 1750;
    if (scale < 0.375) return 1500;
    if (scale < 0.5) return 1000;
    if (scale < 0.75) return 750;
    if (scale < 1) return 500;
    if (scale < 2) return 250;
    if (scale < 4) return 100;
    if (scale < 8) return 50;
    if (scale < 16) return 25;
    if (scale < 32) return 12.5;
    if (scale < 64) return 6.25;
    return 6.25;
}

function drawGrid() {
    ctx.save();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    const spacing = getAdaptiveSpacing(scale);

    ctx.beginPath();
    ctx.strokeStyle = gridColorValue;
    ctx.lineWidth = 1 / scale;

    const startX = -offsetX / scale;
    const startY = -offsetY / scale;
    const endX = startX + canvas.width / scale;
    const endY = startY + canvas.height / scale;

    for (let x = Math.floor(startX / spacing) * spacing; x < endX; x += spacing) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
    }

    for (let y = Math.floor(startY / spacing) * spacing; y < endY; y += spacing) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
    }

    ctx.stroke();
    ctx.restore();
}

canvas.addEventListener('mousedown', (e) => {
    brushCursor.style.top = `${e.clientY}px`;
    brushCursor.style.left = `${e.clientX}px`;
    brushCursor.style.width = `${brushLineWidth.value * scale}px`;
    brushCursor.style.height = `${brushLineWidth.value * scale}px`;
    if (e.button === 1 || drawingMode === 'move') {
        canvas.style.cursor = 'grab';
        isPanning = true;
        panStart.x = e.clientX;
        panStart.y = e.clientY;
        return;
    }

    if (e.button !== 0) return;



    const x = (e.offsetX - offsetX) / scale;
    const y = (e.offsetY - offsetY) / scale;

    if (drawingMode === 'free') {
        isDrawing = true;
        const width = parseFloat(brushLineWidth.value) || 1;
        currentPath = [{ x, y, color: colorSelector.value, width }];
        lastPoint = { x, y };
        brushCursor.style = 'visibility: visible;';
        brushCursor.style.backgroundColor = colorSelector.value;


    } else {
        shapeStart = { x, y };
        brushCursor.style = 'visibility: hidden;';
    };

});

canvas.addEventListener('mouseup', (e) => {
    brushCursor.style.top = `${e.offsetY}px`;
    brushCursor.style.left = `${e.offsetX}px`;
    brushCursor.style.width = `${brushLineWidth.value * scale}px`;
    brushCursor.style.height = `${brushLineWidth.value * scale}px`;
    if (e.button === 1 || drawingMode === 'move') {
        canvas.style.cursor = 'default';
        isPanning = false;
        return;
    }
    if (e.button !== 0) return;


    if (drawingMode === 'free') {
        if (currentPath) {
            paths.push(currentPath);
            currentPath = null;
            brushCursor.style.backgroundColor = colorSelector.value;
            brushCursor.style = 'visibility: visible;';
        }
        isDrawing = false;
    } else if (shapeStart && previewShape) {
        paths.push(previewShape);
        previewShape = null;
        shapeStart = null;
        draw();
    }
});


brushLineWidth.addEventListener('input', () => {
    brushSizeText.textContent = parseFloat(brushLineWidth.value).toFixed(1);
    brushCursor.style.width = `${brushLineWidth.value * scale}px`;
    brushCursor.style.height = `${brushLineWidth.value * scale}px`;

});

brushSizeText.addEventListener('input', () => {
    brushSizeText.textContent = parseFloat(brushLineWidth.value).toFixed(1);
    brushCursor.style.width = `${brushLineWidth.value}px`;
    brushCursor.style.height = `${brushLineWidth.value}px`;
})

colorSelector.addEventListener('input', () => {
    brushColorText.textContent = colorSelector.value;
    brushCursor.style.borderColor = colorSelector.value;
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
});

canvas.addEventListener('input', (e) => {
    brushCursor.style.top = `${e.clientY}px`;
    brushCursor.style.left = `${e.clientX}px`;
    brushCursor.style.width = `${brushLineWidth.value * scale}px`;
    brushCursor.style.height = `${brushLineWidth.value * scale}px`;
});

canvas.addEventListener('focusin', () => {
    brushCursor.style.top = `${e.offsetY}px`;
    brushCursor.style.left = `${e.offsetX}px`;
    brushCursor.style.width = `${brushLineWidth.value * scale}px`;
    brushCursor.style.height = `${brushLineWidth.value * scale}px`;
});

canvas.addEventListener('mousemove', (e) => {

    brushCursor.style.top = `${e.offsetY}px`;
    brushCursor.style.left = `${e.offsetX}px`;
    brushCursor.style.width = `${brushLineWidth.value * scale}px`;
    brushCursor.style.height = `${brushLineWidth.value * scale}px`;

    const x = (e.offsetX - offsetX) / scale;
    const y = (e.offsetY - offsetY) / scale;

    if (isPanning) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        offsetX += dx;
        offsetY += dy;
        panStart.x = e.clientX;
        panStart.y = e.clientY;
        draw();
        return;
    }
    if (drawingMode === 'free') {
        if (!isDrawing || !currentPath) return;
        const width = parseFloat(brushLineWidth.value) || 1;
        const color = colorSelector.value;
        const newPoint = { x, y, color, width };
        const interpolatedPoints = interpolatePoints(lastPoint, newPoint, brushLineWidth.value >= 5 ? 4 : 2);

        currentPath.push(...interpolatedPoints);
        lastPoint = newPoint;
    } else if (shapeStart) {
        const width = parseFloat(brushLineWidth.value) || 1;
        previewShape = (drawingMode === 'circle')
            ? generateCircle(shapeStart.x, shapeStart.y, x, y, colorSelector.value, width, isShiftPressed)
            : {
                type: drawingMode,
                x1: shapeStart.x,
                y1: shapeStart.y,
                x2: x,
                y2: y,
                color: colorSelector.value,
                width
            };
    }

    draw();
});

function interpolatePoints(p1, p2, maxDistance = 2) {
    const points = [];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= maxDistance) {
        points.push(p2);
        return points;
    }
    const steps = Math.floor(distance / maxDistance);
    for (let i = 1; i <= steps; i++) {
        points.push({
            x: p1.x + (dx * i) / steps,
            y: p1.y + (dy * i) / steps,
            color: p2.color,
            width: p2.width,
        });
    }
    return points;
}

toolbar.onmouseenter = () => {
    toolbar.style.opacity = 1;
}

toolbar.onmouseleave = () => {
    toolbar.style.opacity = 0.375;
}


let scale = 1;
let offsetX = 0;
let offsetY = 0;
const MIN_SCALE = 0.1;
const MAX_SCALE = 25;
zoomLevel.textContent = `${(scale * 100).toFixed(1)}%`;
let isDrawing = false;
let lastPoint = null;
let shapeStart = null;

draw();

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    brushCursor.style.width = `${brushLineWidth.value * scale}px`;
    brushCursor.style.height = `${brushLineWidth.value * scale}px`;

    const zoomIntensity = 0.1;
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const zoom = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;

    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * zoom));
    offsetX = mouseX - (mouseX - offsetX) * (newScale / scale);
    offsetY = mouseY - (mouseY - offsetY) * (newScale / scale);
    scale = newScale;
    zoomLevel.textContent = `${(newScale * 100).toFixed(1)}%`;

    draw();
});

zoomLevel.onclick = () => {
    scale = 1;
}

function draw() {

    drawGrid();
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Draw all paths
    for (const path of paths) {
        if (Array.isArray(path)) {
            ctx.beginPath();
            for (let i = 0; i < path.length - 1; i++) {
                const curr = path[i];
                const next = path[i + 1];
                ctx.strokeStyle = curr.color || 'black';
                ctx.lineWidth = Number(curr.width || 1);
                ctx.moveTo(curr.x, curr.y);
                ctx.lineTo(next.x, next.y);
            }
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.strokeStyle = path.color;
            ctx.lineWidth = Number(path.width || 1);
            const { x1, y1, x2, y2 } = path;

            if (path.type === 'line') {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            } else if (path.type === 'square') {
                const width = x2 - x1;
                const height = y2 - y1;
                ctx.strokeRect(x1, y1, width, height);
            } else if (path.type === 'circle') {
                const radius = Math.hypot(x2 - x1, y2 - y1);
                ctx.arc(x1, y1, radius, 0, Math.PI * 2);
            } else if (path.type === 'ellipse') {
                const rx = Math.abs(x2 - x1);
                const ry = Math.abs(y2 - y1);
                ctx.ellipse(x1, y1, rx, ry, 0, 0, Math.PI * 2);
            }


            ctx.stroke();
        }
    }

    // Draw current path (in-progress freehand stroke)
    if (currentPath) {
        ctx.beginPath();
        for (let i = 0; i < currentPath.length - 1; i++) {
            const curr = currentPath[i];
            const next = currentPath[i + 1];
            ctx.strokeStyle = curr.color || colorSelector.value;
            ctx.lineWidth = Number(curr.width || 1);
            ctx.moveTo(curr.x, curr.y);
            ctx.lineTo(next.x, next.y);
        }
        ctx.stroke();
    }
    // Draw preview shape (while dragging)
    if (previewShape) {
        ctx.beginPath();
        ctx.strokeStyle = previewShape.color;
        ctx.lineWidth = Number(previewShape.width || 1);
        const { x1, y1, x2, y2 } = previewShape;
        if (previewShape.type === 'line') {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        } else if (previewShape.type === 'square') {
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        } else if (previewShape.type === 'circle') {
            const radius = Math.hypot(x2 - x1, y2 - y1);
            ctx.arc(x1, y1, radius, 0, Math.PI * 2);
        } else if (previewShape.type === 'ellipse') {
            const rx = Math.abs(x2 - x1);
            const ry = Math.abs(y2 - y1);
            ctx.ellipse(x1, y1, rx, ry, 0, 0, Math.PI * 2);

        }

        ctx.stroke();

        if (previewShape.type === 'circle') {
            // Draw radius details
            const radius = Math.hypot(x2 - x1, y2 - y1);

            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1 / scale;
            ctx.stroke();
            // Radius line
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Radius text
            ctx.fillStyle = 'black';
            ctx.font = `${18 / scale}px segoe ui`;
            ctx.textBaseline = 'middle';

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetXText = -dy / len * 10 / scale;
            const offsetYText = dx / len * 10 / scale;

            ctx.fillText(`${radius.toFixed(1)} px`, midX + offsetXText, midY + offsetYText);
        }
        else if (previewShape.type === 'ellipse') {

            // Draw the ellipse
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1 / scale;
            ctx.stroke();

            // Radius line (diagonal from center to end)
            ctx.beginPath();
            ctx.lineWidth = 1 / scale;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            // Radius label
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.hypot(dx, dy); // This is the diagonal radius

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const offsetXText = -dy / len * 10 / scale;
            const offsetYText = dx / len * 10 / scale;

            ctx.fillStyle = 'black';
            ctx.font = `${18 / scale}px segoe ui`;
            ctx.textBaseline = 'middle';
            ctx.fillText(`${len.toFixed(1)} px`, midX + offsetXText, midY + offsetYText);
        }


    }

    ctx.restore();
    zoomLevel.textContent = `${(scale * 100).toFixed(1)}%`;

}

clearBtn.onclick = () => {
    clearCanvas();
};

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'e':
            clearCanvas();
            break;
        case 'c':
            drawingMode = 'circle';
            activateBtnByMode('circle');
            break;
        case 'r':
            drawingMode = 'square';
            activateBtnByMode('square');
            break;
        case 'm':
            drawingMode = 'move';
            activateBtnByMode('move');
            break;
        case 'f':
            drawingMode = 'free';
            activateBtnByMode('free');
            break;
        case 'l':
            drawingMode = 'line';
            activateBtnByMode('line');
            break;
        case 't':
            drawingMode = 'text';
            activateBtnByMode('text');
            break;
        default:

            break;

    }
});



window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
        if (paths.length) {
            paths.pop();
            draw();
        }
    }
});

function resizeCanvasPreserve() {
    const buffer = document.createElement('canvas');
    buffer.width = canvas.width;
    buffer.height = canvas.height;
    buffer.getContext('2d').drawImage(canvas, 0, 0);

    resizeCanvas();

    ctx.drawImage(buffer, 0, 0);
}


function clearCanvas() {
    paths = [];
    currentPath = null;
    previewShape = null;
    shapeStart = null;
    isDrawing = false;
    draw();
}

function generateCircle(x1, y1, x2, y2, color, width, constrain = false) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (constrain) {
        const side = Math.max(Math.abs(dx), Math.abs(dy));
        const radius = side;
        return {
            type: 'circle',
            x1,
            y1,
            x2: x1 + radius * Math.sign(dx),
            y2: y1 + radius * Math.sign(dy),
            color,
            width
        };
    }

    // Ellipse mode
    return {
        type: 'ellipse',
        x1,
        y1,
        x2,
        y2,
        color,
        width
    };
}

