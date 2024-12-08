import { repBuilder } from "../rep-builder";
import { generatePulp } from "../pulp-plotter";

describe('Generate Pulp', () => {
  const example1 = `
    node n = [rot=1; rad=1].
    path = n.
  `;

  beforeEach(() => {
    repBuilder.reset();
  }); 

  it('Should run successfully', () => {
    repBuilder.start(example1);
    const pulps = generatePulp(repBuilder.getPaths());
  });

  it('Should generate 3600 pulps', () => {
    repBuilder.start(example1);
    const pulps = generatePulp(repBuilder.getPaths());
    expect(pulps.length).toBe(3600);
  });
});