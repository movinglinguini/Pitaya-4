import { NodeRep, PathRep } from '../rep-builder';
import { getDistance, lerp, toDeg, toRad } from '../utils';

const THETA_PER_TICK = 5;
const RADIUS_STEP_PER_TICK = 0.01;
const CIRCLE_THETA = 360;

export type Pulp = {
  x : number,
  y : number,
};

export function generatePulp(paths : PathRep[]) : Pulp[] {
  const pulps: Pulp[] = [];

  paths.forEach(p => {    
    if (!p.seed) return;
    let currP : PathRep | null = p;
    let arcEnd1 = 0;
    let fromRadius = p.seed.rad;
    let currRadius = p.seed.rad;

    while (currP) {
      const seed = currP.seed as NodeRep;
      const cx = seed.x;
      const cy = seed.y;
      const arcEnd2 = CIRCLE_THETA * (Math.abs(seed.rot)) + arcEnd1;

      const startTheta = Math.min(arcEnd1, arcEnd2);
      const endTheta = Math.max(arcEnd1, arcEnd2);

      let targetRadius = seed.rad;

      let px : number = 0;
      let py : number = 0;

      let radiusStepInterval = 0;

      for (let i = startTheta; i <= endTheta; i += THETA_PER_TICK) {
        const theta = i % CIRCLE_THETA;

        // Step toward target radius
        currRadius = lerp(fromRadius, targetRadius, radiusStepInterval);
        radiusStepInterval = Math.min(1, radiusStepInterval + RADIUS_STEP_PER_TICK);
        
        px = cx + Math.cos(toRad(theta)) * currRadius;
        py = cy + Math.sin(toRad(theta)) * currRadius;

        // Push in new pulp
        pulps.push({
          x: px,
          y: py,
        });
      }

      // Get the new arc start and the new radius to start with
      if (currP.next && currP.next.seed) {
        const nextSeed = currP.next.seed;
        fromRadius = getDistance(px, py, nextSeed?.x, nextSeed?.y);
        arcEnd1 = toDeg(Math.atan2(py - nextSeed.y, px - nextSeed.x));
      }
      // Advance in the path
      currP = currP.next;
    }
  });

  return pulps;
}

