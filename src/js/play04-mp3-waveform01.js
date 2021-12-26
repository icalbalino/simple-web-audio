let sound = "../audio/chime.mp3";
let audioContext;
let audioBuffer;
let analyserNode;
let analyserData;
let gainNode;


function setup() {
    let con = document.querySelector('div.div1');
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.class('p5canvas1');
    canvas.parent(con);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    playSound();
}

async function loadSound() {
    // Re-use the same context if it exists
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    // Re-use the audio buffer as a source
    if (!audioBuffer) {
        // Fetch MP3 from URL
        const resp = await fetch(sound);

        // Turn into an array buffer of raw binary data
        const buf = await resp.arrayBuffer();

        // Decode the entire binary MP3 into an AudioBuffer
        audioBuffer = await audioContext.decodeAudioData(buf);
    }

    // Setup a master gain node and AnalyserNode
    if (!gainNode) {
        // Create a gain and connect to destination
        gainNode = audioContext.createGain();

        // Create an Analyser Node
        analyserNode = audioContext.createAnalyser();

        // Create a Float32 array to hold the data
        analyserData = new Float32Array(analyserNode.fftSize);

        // Connect the GainNode to the analyser
        gainNode.connect(analyserNode);

        // Connect GainNode to destination as well
        gainNode.connect(audioContext.destination);
    }
}

async function playSound() {
    // Ensure we are all loaded up
    await loadSound();

    // Ensure we are in a resumed state
    await audioContext.resume();

    // Now create a new "Buffer Source" node for playing AudioBuffers
    const source = audioContext.createBufferSource();

    // Connect to destination
    source.connect(audioContext.destination);

    // Connect to gain (which will be analyzed and also sent to destination)
    source.connect(gainNode);

    // Assign the loaded buffer
    source.buffer = audioBuffer;

    // Start (zero = play immediately)
    source.start(0);
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