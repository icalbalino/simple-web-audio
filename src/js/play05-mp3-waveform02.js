let sound = "../audio/roa-onewish.mp3";
let audioContext;
let analyserNode;
let analyserData;
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
        
        // Make a stream source, i.e. MP3, microphone, etc
        // In this case we choose an <audio> element
        audio = document.createElement("audio");
        audio.loop = true; // Enable looping so the audio never stops
        audio.src = sound; // Set the URL of the audio asset

        // To play audio through Glitch.com CDN
        // audio.crossOrigin = "Anonymous";

        // Upon loading the audio, let's play it
        audio.addEventListener('canplay', () => {
            // First, Ensure we are in a resumed state
            audioContext.resume();
            // Now, play/trigger audio
            audio.play(); 
        }, { once: true });

        // Create a "Media Element" source node
        const source = audioContext.createMediaElementSource(audio);

        // Connect source into the WebAudio context
        source.connect(audioContext.destination);

        // Create an Analyser Node
        analyserNode = audioContext.createAnalyser();

        // You can increase the detail to some power-of-two value
        const detail = 4;

        // This will give you more samples of data per second
        analyserNode.fftSize = 2048 * detail;

        // Create a Float32 array to hold the data
        analyserData = new Float32Array(analyserNode.fftSize);

        // connect source to analyser
        source.connect(analyserNode);
    } else {
        // Kill the audio and clean up our element and audio context
        audio.pause();
        audioContext.close();
        audioContext = audio = null;
        audioContext = analyserNode = null;
    }
}

function draw() {
    background("black");
    const dim = min(width, height);
    if (analyserNode) {
        noFill();
        stroke("white");

        // get time domain data
        analyserNode.getFloatTimeDomainData(analyserData);

        let hmin = height / 2 - height / 4;
        let hplus = height / 2 + height / 4;

        beginShape();
        for (let i = 0; i < analyserData.length; i++) {
            // -1...1
            const amplitude = analyserData[i];
            const y = map(amplitude, -1, 1, hmin, hplus)
            const x = map(i, 0, analyserData.length - 1, 0, width);
            vertex(x, y);
        }
        endShape();
    } else {
        fill("white");
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