let sound = "../audio/jiglr-lovetrip.mp3";
let audioContext;
let analyserNode;
let signalData;
let audio;


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

// this function fires only when canvas is clicked
const mouseClick = function () {
    if (!audioContext) {
        // Create a new audio context
        audioContext = new AudioContext();
        
        // Create <audio> tag, in this case we choose an audio element
        audio = document.createElement("audio");
        audio.loop = true; // Enable looping so the audio never stops
        audio.src = sound; // Set the URL of the audio asset

        // To play audio through Glitch.com CDN
        // audio.crossOrigin = "Anonymous";

        audio.play(); // play/trigger audio

        // Create a "Media Element" source node
        const source = audioContext.createMediaElementSource(audio);

        // Create an Analyser Node
        analyserNode = audioContext.createAnalyser();
        analyserNode.smoothingTimeConstant = 1;

        // Create FFT data
        signalData = new Float32Array(analyserNode.fftSize);

        // Connect source into the WebAudio context
        source.connect(audioContext.destination);

        // Connect the source to the analyser node as well
        source.connect(analyserNode);
    } else {
        // Kill the audio and clean up our element and audio context
        if (audio.paused) audio.play();
        else audio.pause();
    }
}

// Get the root mean squared of a set of signals
function rootMeanSquaredSignal(data) {
    let rms = 0;
    for (let i = 0; i < data.length; i++) {
        rms += data[i] * data[i];
    }
    return Math.sqrt(rms / data.length);
}

function draw() {
    background("black");
    const dim = min(width, height);
    if (analyserNode) {
        noFill();
        stroke("red");

        // Get the *time domain* data (not the frequency)
        analyserNode.getFloatTimeDomainData(signalData);

        // Get the root mean square of the data
        const signal = rootMeanSquaredSignal(signalData);
        const scale = 2; // scale the data a bit so the circle is bigger
        const size = dim * scale * signal;

        strokeWeight(dim * 0.075);
        circle(width / 2, height / 2, size);
    } else {
        fill("red");
        noStroke();
        polygon(width / 2, height / 2, dim * 0.1, 3);
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