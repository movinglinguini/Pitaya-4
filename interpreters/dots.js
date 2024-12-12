const drawEvery = 100;

let pulpIdx = 0;

function setup() {
  createCanvas(400, 400);
  stroke('black');
  strokeWeight(3);
  background(220);
}

function draw() {
  for (let i = pulpIdx; i < pulpIdx + drawEvery; i += 1) {
    if (i <= pulp.length - 1) {
      const p = pulp[i];
      point(p.x + width * 0.5, p.y + height * 0.5);
    }
  }

  pulpIdx += drawEvery;
}
