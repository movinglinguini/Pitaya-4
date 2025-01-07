const drawEvery = 1000;

let pulpIdx = 0;

function setup() {
  createCanvas(400, 400);
  strokeWeight(2);
  background(220);
}

function draw() {
  for (let i = pulpIdx; i < pulpIdx + drawEvery; i += 1) {
    if (i < pulp.length - 1) {
      const p1 = pulp[i];
      const p2 = pulp[i + 1];
  
      if (p1.p === p2.p) {
        stroke(p1.color);
        line(
          p1.x + width * 0.5,
          p1.y + height * 0.5, 
          p2.x + width * 0.5,
          p2.y + height * 0.5
        );
      }
    }
  }

  pulpIdx += drawEvery;
}
