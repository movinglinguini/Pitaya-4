import { NodeRep, PathRep } from '../rep-builder';
import { getDistance, lerp, toDeg, toRad } from '../../utils';

const CIRCLE_THETA = 360;

export type Pulp = {
  x : number,
  y : number,
  p : number,
  color : string,
};

export function generatePulp(paths : PathRep[]) : Pulp[] {
  const pulps: Pulp[] = [];

  paths.forEach((p, pidx) => {    
    if (!p.seed) return;
    let currP : PathRep | null = p;
    let arcEnd1 = 0;
    let fromRadius = p.seed.rad;

    while (currP) {
      const seed = currP.seed as NodeRep;
      const cx = seed.x;
      const cy = seed.y;
      const arcEnd2 = CIRCLE_THETA * seed.rot + arcEnd1;
      const THETA_STEP_PER_TICK = seed.thetaStep;
      const RADIUS_STEP_PER_TICK = seed.radiusStep;

      let targetRadius = seed.rad;

      let px : number = 0;
      let py : number = 0;

      let radiusStepInterval = 0;
      let thetaStepInterval = 0;

      while (thetaStepInterval < 1) {
        const theta = lerp(arcEnd1, arcEnd2, thetaStepInterval) % 360;
        thetaStepInterval = Math.min(1, thetaStepInterval + THETA_STEP_PER_TICK);

        const radius = lerp(fromRadius, targetRadius, radiusStepInterval);
        radiusStepInterval = Math.min(1, radiusStepInterval + RADIUS_STEP_PER_TICK);
        
        px = cx + Math.cos(toRad(theta)) * radius;
        py = cy + Math.sin(toRad(theta)) * radius;

        // Push in new pulp
        pulps.push({
          x: px,
          y: py,
          p : pidx,
          color : seed.color,
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

