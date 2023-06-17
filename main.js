const WIDTH = 300;
const HEIGHT = 150;
const SCALE = 10;
const BLACK = [0,0,0,255]
const WHITE = [255,255,255,255]
const BROWN = [150,75,0,255]
const GREEN = [0,255,0,255]
const SAND = [194, 178, 128,255]
const SAND2 = [239, 226, 184, 255]
const WATER = [15,94,156,255]
let canvas = null;
let ctx = null;

current_color = 1;
clicking = false;
start = false;
screen = new Array(WIDTH*HEIGHT).fill(0);
for (let index = 0; index < WIDTH*HEIGHT; index++) {
    // Set screen[index] to 0 or 1 randomly
    current_elevation = HEIGHT - Math.floor(index / WIDTH);
    current_color = Math.round(current_elevation / 50);
    screen[index] = Math.round(Math.round(Math.random() / 1.5) * current_color);
}

function setColor(color) {
    current_color = color;
}
function getColor(color) {
    switch (color) {
        case 1: return BLACK;
        case 0: return WHITE;
        case 2: return BROWN;
        case 3: return GREEN;
        case 4: 
            if (Math.random() > 0.5) {
                return SAND;
            } else {
                return SAND2;
            }
        case 5: return WATER;
        default: break;
    }
}

function convertScreenToCanvas(screen) {
    // For each pixel in screen, if its a 1 then set the corresponding pixel in canvas to black
    // If its a 0 then set the corresponding pixel in canvas to white
    // Return the canvas
    var canvas = new Uint8ClampedArray(WIDTH*HEIGHT*4).fill(0);
    for (let index = 0; index < WIDTH*HEIGHT; index++) {
        color = getColor(screen[index])
        canvas[index*4] = color[0];
        canvas[index*4+1] = color[1];
        canvas[index*4+2] = color[2];
        canvas[index*4+3] = color[3];
    }
    return canvas;
}
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    screen[Math.floor(x) + WIDTH*Math.floor(y)] = current_color;
}


function gravity(screen) {
    var canvas = new Uint8ClampedArray(WIDTH*HEIGHT*4).fill(0);
    // Loop through each from from bottom to top and check if the space below it is empty
    // If it is then move the piece down one space
    // If it isn't then do nothing
    for (let index = 0; index < WIDTH*HEIGHT; index++) {
        if (screen[index] !== 0 && screen[index] != 5) {
            if (screen[index+WIDTH] == 0 && index+WIDTH < (WIDTH*HEIGHT)) {
                canvas[index+WIDTH] = screen[index];
                canvas[index] = screen[index+WIDTH];
            } else if (screen[index+WIDTH - 1] == 0 && index+WIDTH < (WIDTH*HEIGHT) && index % WIDTH != 0) {
                canvas[index+WIDTH - 1] = screen[index];
                canvas[index] = screen[index+WIDTH - 1];
            } else if (screen[index+WIDTH + 1] == 0 && index+WIDTH < (WIDTH*HEIGHT) && index % WIDTH != WIDTH-1) {
                canvas[index+WIDTH + 1] = screen[index];
                canvas[index] = screen[index+WIDTH + 1];
            } else {
                canvas[index] = screen[index];  
            }
        } else if (screen[index] == 5) { 
            if (screen[index+WIDTH] == 0 && index+WIDTH < (WIDTH*HEIGHT)) {
                canvas[index+WIDTH] = screen[index];
                canvas[index] = screen[index+WIDTH];
            } else if (screen[index+WIDTH - 1] == 0 && index+WIDTH < (WIDTH*HEIGHT) && index % WIDTH != 0) {
                canvas[index+WIDTH - 1] = screen[index];
                canvas[index] = screen[index+WIDTH - 1];
            } else if (screen[index+WIDTH + 1] == 0 && index+WIDTH < (WIDTH*HEIGHT) && index % WIDTH != WIDTH-1) {
                canvas[index+WIDTH + 1] = screen[index];
                canvas[index] = screen[index+WIDTH + 1];
            } else if (screen[index-1] == 0) {
                canvas[index-1] = 5;
                canvas[index] = screen[index-1];
            } else if (screen[index+1] == 0) {
                canvas[index+1] = 5;
                canvas[index] = screen[index+1];
            } else {
                canvas[index] = screen[index];  
            }
        }
    }
    return canvas
}

window.onload = () => {
    start = true
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    ctx.scale(2,2);

    canvas.addEventListener('mousedown', (e) => {
        clicking = true;
    })
    canvas.addEventListener('mouseup', (e) => {
        clicking = false;
    })
    canvas.addEventListener('mousemove', (e) => {   
        if (clicking) {
            getCursorPosition(canvas, e);
        }  
    })
}

function update() {
    if (!start) {
        return
    }

    screen = gravity(screen);
    
    pixelData = convertScreenToCanvas(screen);
    
    var imgData = new ImageData(pixelData, WIDTH, HEIGHT);

    ctx.putImageData(imgData, 0, 0);
    
    
}

setInterval(() => {update(screen)},100)