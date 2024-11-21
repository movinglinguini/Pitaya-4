const parser = require('../parser/parser.js');

describe('Parse Syntax', () => {
  const exampleProgram1 = `
node n = [rot=1; rad=1].

path = n->[len=10;phi=90]n=>[len=10;phi=90]n->[len=10;phi=90](n->[len=10;phi=90]n).
`;

  const exampleProgram2 = `
node n = [rotations=1; radius=1;]

path = n->[l=10;a=90]n.
`;


  test('Example program should pass syntax check', () => {
    expect(parser.parse(exampleProgram1)).toBeUndefined();
  });

  test('Example program should fail syntax check', () => {
    expect(() => parser.parse(exampleProgram2)).toThrow();
  });
});