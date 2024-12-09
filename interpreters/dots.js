const container = document.querySelector('#container');

let pulpIdx = 0;

function setup() {
  createCanvas(400, 400);
  stroke('black');
  strokeWeight(3);
  background(220);
}

function draw() {
  if (pulpIdx <= pulp.length - 1) {
    const p = pulp[pulpIdx];
    point(p.x + width * 0.5, p.y + height * 0.5);
    pulpIdx += 1;
  }
}
