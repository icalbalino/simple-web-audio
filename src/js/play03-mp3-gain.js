let audioContext;
let audio;
let gainNode;
let sound = "./audio/firefl!es-broken.mp3";

function setup() {
    let con = document.querySelector('div.div1');
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.class('p5canvas1');
    canvas.parent(con);
    canvas.mousePressed(mouseClick);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

const mouseClick = function () {
    if (!audioContext) {
        // Create a new audio context
        audioContext = new AudioContext();
        audio = document.createElement("audio");
        audio.loop = true; // Enable looping so the audio never stops
        audio.src = sound; // set the URL of the audio asset

        // To play audio through Glitch.com CDN
        // audio.crossOrigin = "Anonymous";

        audio.play(); // Play/trigger audio

        // Create a "Media Element" source node
        const source = audioContext.createMediaElementSource(audio);

        // Create a gain for volume adjustment
        gainNode = audioContext.createGain();
        
        source.connect(gainNode); // wire source to gain
        gainNode.connect(audioContext.destination); // wire the gain to speaker
    } else {
        // Stop the audio
        // Clean up our element and audio context
        audio.pause();
        audioContext.close();
        audioContext = audio = null;
    }
}

function draw() {
    background("black");
    const dim = min(width, height);
    if (!audioContext) {
        fill("white");
        noStroke();
        polygon(width / 2, height / 2, dim * 0.1, 3);
    } else {
        fill("white");
        noStroke();
        // Get a new volume based on mouse position
        var volume = abs(( mouseX - width / 2) - (mouseY - height / 2)) / ((width / 2) - (height / 2));
        // Schedule a gradual shift in value with a small time constant
        gainNode.gain.setTargetAtTime(volume, audioContext.currentTime, 0.01);
        // Draw a volume meter
        rectMode(CENTER);
        circle(width / 2, height / 2, dim * volume, dim * 0.5);
    }
}

// Draw a basic polygon, handles triangles, squares, pentagons, etc
function polygon(x, y, radius, sides = 3, angle = 0) {
    beginShape();
    for (let i = 0; i < sides; i++) {
        const a = angle + TWO_PI * (i / sides);
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}