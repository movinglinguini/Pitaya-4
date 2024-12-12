import { repBuilder } from "../src/rep-builder";
import { generatePulp } from "../src/pulp-plotter";

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
});