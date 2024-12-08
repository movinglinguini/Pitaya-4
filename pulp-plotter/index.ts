import { NodeRep, PathRep } from '../rep-builder';
import { getDistance, lerp, toDeg, toRad } from '../utils';

const THETA_PER_TICK = 0.1;
const RADIUS_STEP_PER_TICK = 0.1;
const CIRCLE_THETA = 360;

export type Pulp = {
  x : number,
  y : number,
};

export function generatePulp(paths : PathRep[]) : Pulp[] {
  const pulps: Pulp[] = [];

  paths.forEach(p => {    
    if (!p.seed) return;
    const seed: NodeRep = p.seed;
    const targetRadius = seed.rad;

    let currP : PathRep | null = p;
    let arcEnd1 = 0;
    let radius = seed.rad;
    let radiusStepInterval = 0;

    while (currP) {
      
      const cx = seed.x;
      const cy = seed.y;
      const arcEnd2 = CIRCLE_THETA * seed.rot + arcEnd1;

      const startTheta = Math.min(arcEnd1, arcEnd2);
      const endTheta = Math.max(arcEnd1, arcEnd2);

      let px : number = 0;
      let py : number = 0;

      for (let i = startTheta; i <= endTheta; i += THETA_PER_TICK) {
        const theta = i % CIRCLE_THETA;
        
        // Step toward target radius
        radius = lerp(radius, targetRadius, radiusStepInterval);
        radiusStepInterval = Math.min(1, radiusStepInterval + RADIUS_STEP_PER_TICK);
        
        px = cx + Math.sin(toRad(theta)) * radius;
        py = cy + Math.sin(toRad(theta)) * radius;

        // Push in new pulp
        pulps.push({
          x: px,
          y: py,
        });
      }

      // Get the new arc start and the new radius to start with
      if (currP.next && currP.next.seed) {
        const nextSeed = currP.next.seed;
        radius = getDistance(px, py, nextSeed?.x, nextSeed?.y);
        arcEnd1 = toDeg(Math.atan2(py - nextSeed.y, px - nextSeed.x));
      }
      // Advance in the path
      currP = currP.next;
    }
  });

  return pulps;
}

