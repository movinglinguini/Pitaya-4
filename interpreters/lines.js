let pulpIdx = 0;

function setup() {
  createCanvas(400, 400);
  stroke('black');
  strokeWeight(2);
  background(220);
}

function draw() {
  if (pulpIdx < pulp.length - 1) {
    const p1 = pulp[pulpIdx];
    const p2 = pulp[pulpIdx + 1];

    if (p1.p === p2.p) {
      line(
        p1.x + width * 0.5,
        p1.y + height * 0.5, 
        p2.x + width * 0.5,
        p2.y + height * 0.5
      );
    }

    pulpIdx += 1;
  }
}
