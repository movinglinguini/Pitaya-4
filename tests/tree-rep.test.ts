import { repBuilder, States } from '../tree-rep';

describe('Rep Builder', () => {
  const exampleProgram1 = `
node n = [rot=1; rad=1].

path = n->[len=10;phi=90]n=>[len=10;phi=90]n->[len=10;phi=90](n->[len=10;phi=90]n)->[phi=90]n.
`;

  test('Example should end with period state.', async () => {
    await repBuilder.start(exampleProgram1);
    const sm = repBuilder.getSM();

    expect(sm.getState()).toBe(States.period);
  });
});