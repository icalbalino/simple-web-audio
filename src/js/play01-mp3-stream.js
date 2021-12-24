let audioContext;
let audio;
let sound = "./audio/piano.mp3";

function setup() {
    let con = document.querySelector('div.div1');
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.class('p5canvas1');
    canvas.parent(con);

    let ccs = document.querySelector('canvas.p5canvas1');
    ccs.style.width = '100%';
    ccs.style.height = '100%';

    canvas.mousePressed(mouseClick); // attach listener for canvas click only
}


// this function fires only when canvas is clicked
const mouseClick = function () {
    if (!audioContext) {
        // setup our audio
        audioContext = new AudioContext();

        // create new <audio> tag
        audio = document.createElement("audio");

        // optional; enable audio looping
        audio.loop = true;

        // set the URL of the audio asset
        audio.src = sound;

        // trigger audio
        audio.play();

        const source = audioContext.createMediaElementSource(audio);

        // wire the source to the 'speaker'
        source.connect(audioContext.destination);
    } else {
        // stop the audio
        audio.pause();
        audioContext.close();
        audioContext = audio = null;
    }
}


function draw() {
    background("black");
    const dim = min(width, height);
    if (!audioContext) {
        polygon(width / 2, height / 2, dim * 0.1, 3);
        fill("white");
        noStroke();
    } else {
        polygon(width / 2, height / 2, dim * 0.1, 4, PI / 4);
        fill("white");
        noStroke();
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