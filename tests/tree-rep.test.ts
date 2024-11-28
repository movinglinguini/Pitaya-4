import { repBuilder } from '../tree-rep';

describe('Rep Builder', () => {
  const exampleProgram1 = `
node n = [rot=1; rad=1].
`;

  const exampleProgram2 = `
node n1 = [rot=1; rad=1].
node n2 = [rot=1; rad=1].
`;

  const exampleProgram3 = `
node n1 = [rot=1; rad=1].
node n1 = [rot=1; rad=1].
`;

  const exampleProgram4 = `
node n1 = [rot=1.25; rad=20.25].
`;

  beforeEach(() => {
    repBuilder.reset();
  }); 

  test('Example should have one node.', () => {
    repBuilder.start(exampleProgram1);

    const nodes = repBuilder._nodeReps;

    expect(nodes.size).toBe(1);
  });

  test('Example should have two nodes.', () => {
    repBuilder.start(exampleProgram2);

    const nodes = repBuilder._nodeReps;

    expect(nodes.size).toBe(2);
  });

  test('Example node should have the correct parameters.', () => {
    repBuilder.start(exampleProgram4);

    const nodes = repBuilder._nodeReps;
    const n = nodes.get('n1');

    expect(n?.rot).toBe(1.25);
    expect(n?.rad).toBe(20.25);
  });

  
});