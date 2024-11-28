export {};
const parser : {
  parse: (string: string, parseOptions?: Object) => void,
  onShift: (token: any) => any,
} = require('../parser/parser.js');

describe('Parse Syntax', () => {
  const exampleProgram1 = `
node n = [rot = 10; rad = 20].
path = n ->[len=20] n ->[phi=95] n ->[phi=94] (n ->[len=20] n).
`;

  const exampleProgram2 = `
node n = [rot = 10; rad = 20].
path = n ->[len=20] n ->[phi=95] n.
`;

  const exampleProgram3 = `
node n = [rot=1; rad=1].

path = n->[l=10;a=90]n.
`;

  test('Example program should pass syntax check', async () => {
    const res = parser.parse(exampleProgram1);
    expect(res).toBeUndefined();
  });

  test('Example program should pass syntax check', async () => {
    const res = parser.parse(exampleProgram2);
    expect(res).toBeUndefined();
  });

  test('Example program should fail syntax check', () => {
    expect(() => parser.parse(exampleProgram3)).toThrow();
  });
});