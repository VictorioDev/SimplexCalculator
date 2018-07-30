var img;

function setup() {
    createCanvas(displayWidth, displayHeight);
    img = loadImage('assets/sadboy.jpg');
}

function draw() {
    image(img, 0, 0);
}