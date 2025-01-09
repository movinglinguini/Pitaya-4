import { chooseRandom, getRandom } from "../utils";

export type GeneratorOptions = {
  nodeCountRange? : [number, number],
  nodeRadRange? : [number, number],
  nodeRotRange? : [number, number],
  nodeThetaStepRange? : [number, number],
  nodeRadStepRange? : [number, number],
  nodeColors? : string[],
  pathCountRange? : [number, number],
  pathDepthRange? : [number, number],
  pathLenRange? : [number, number],
  pathThetaRange? : [number, number],
}

type _GeneratorOptions = {
  nodeCountRange : [number, number],
  nodeRadRange : [number, number],
  nodeRotRange : [number, number],
  nodeThetaStepRange : [number, number],
  nodeRadStepRange : [number, number],
  nodeColors : string[],
  pathCountRange : [number, number],
  pathDepthRange : [number, number],
  pathLenRange : [number, number],
  pathThetaRange : [number, number],
}

const defaultOptions : _GeneratorOptions = {
  nodeCountRange : [ 0, 5 ],
  nodeRadRange : [0, 100],
  nodeRotRange : [0, 15],
  nodeThetaStepRange : [0.01, 0.01],
  nodeRadStepRange : [0.01, 0.01],
  nodeColors : ['#000'],
  pathCountRange : [1, 5],
  pathDepthRange : [3, 10],
  pathLenRange : [0, 200],
  pathThetaRange : [0, 360],
};

export function generateProgram(options: GeneratorOptions) {
  const options_ = {...defaultOptions, ...options};

  const nodeCount = getRandom(...options_.nodeCountRange);
  const pathCount = getRandom(...options_.pathCountRange);

  const program: string[] = [];
  const nodes: string[] = [];

  for (let i = 0; i < nodeCount; i += 1) {
    program.push(`node n${i} = [rad=${getRandom(...options_.nodeRadRange)}; rot=${getRandom(...options_.nodeRotRange)}; thetaStep=${getRandom(...options_.nodeThetaStepRange)}; radiusStep=${getRandom(...options_.nodeRadStepRange)}; color=${chooseRandom(options_.nodeColors)} ].`);
    nodes.push(`n${i}`);
  }

  for (let i = 0; i < pathCount; i += 1) {
    let newPath = 'path = ';
    const pathDepth = getRandom(...options_.pathDepthRange);

    for (let j = 0; j <= pathDepth; j += 1) {
      newPath += `${chooseRandom(nodes)} -> [len=${getRandom(...options_.pathLenRange)}; theta=${getRandom(...options_.pathThetaRange)}]`
    }

    newPath += `${chooseRandom(nodes)}.`;
    program.push(newPath);
  }

  console.log(program);

  return program.join('\n');
}

