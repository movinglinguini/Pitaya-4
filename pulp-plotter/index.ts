import { NodeRep, PathRep } from '../rep-builder';
import { toRad } from '../utils';

const THETA_PER_TICK = 0.1;
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
    let startTheta = 0;

    while (currP) {
      const seed: NodeRep = p.seed;
      const cx = seed.x;
      const cy = seed.y;
      const endTheta = CIRCLE_THETA * seed.rot;

      for (let i = startTheta; i <= endTheta; i += THETA_PER_TICK) {
        const theta = i % CIRCLE_THETA;
        
      }
      currP = currP.next;
    }
  });

  return pulps;
}
