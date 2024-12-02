export {};
import { t, StateMachine } from 'typescript-fsm';

const DEFAULT_NODE_NAME = '';
const DEFAULT_NODE_ROT = 0;
const DEFAULT_NODE_RADIUS = 0;
const DEFAULT_NODE_REP: NodeRep = {
  name : DEFAULT_NODE_NAME,
  rot : DEFAULT_NODE_ROT,
  rad : DEFAULT_NODE_RADIUS
};
const DEFAULT_PATH_REP: PathRep = {
  edges: [],
}
const DEFAULT_EDGE_REP: EdgeRep = {
  seed: copyObject(DEFAULT_NODE_REP),
  next: null,
  len: 0,
  phi: 0,
}

enum TokenTypes {
  NODE_KEYWORD = 'NODE_KEYWORD',
  PATH_KEYWORD = 'PATH_KEYWORD',
  ROTATIONS_KEYWORD = 'ROTATIONS_KEYWORD',
  RADIUS_KEYWORD = 'RADIUS_KEYWORD',
  LENGTH_KEYWORD = 'LENGTH_KEYWORD',
  ANGLE_KEYWORD = 'ANGLE_KEYWORD',
  BIG_ARROW = 'BIG_ARROW',
  SMALL_ARROW = 'SMALL_ARROW',
  EQUALS = 'EQUALS',
  PARAMETER_OPEN_BRACKET = 'PARAMETER_OPEN_BRACKET',
  PARAMETER_CLOSE_BRACKET = 'PARAMETER_CLOSE_BRACKET',
  NUMBER = 'NUMBER',
  WORD = 'WORD',
  SEMICOLON = 'SEMICOLON',
  PERIOD = 'PERIOD',
  OPEN_PARENTHESES = 'OPEN_PARENTHESES',
  CLOSE_PARENTHESES = 'CLOSE_PARENTHESES'
}

type Token = {
  type : string,
  value : string,
  startOffset : number,
  endOffset : number,
  startLine : number,
  endLine : number,
  startColumn : number,
  endColumn : number,
}

type NodeRep = {
  name : string,
  rot : number,
  rad : number,
};

type EdgeRep = {
  len : number,
  phi : number,
  next : PathRep | null,
  seed : NodeRep,
};

type PathRep = {
  edges : EdgeRep[],
};

enum RepBuilderModes {
  none,
  node,
  path,
}

enum RepParamModes {
  none,
  rot,
  rad,
}

enum RepArrowModes {
  none,
  big,
  small
}

function copyObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const parser : {
  parse : (string: string, parseOptions?: Object) => Promise<void>,
  onShift : (token: Token) => Token,
} = require('../parser/parser.js');

export const repBuilder = ({
  _parser : parser,
  _mode : RepBuilderModes.none,
  _paramMode : RepParamModes.none,
  _arrowMode : RepArrowModes.none,
  _newNodeRep : copyObject(DEFAULT_NODE_REP),
  _nodeReps : new Map<string, NodeRep>(),
  _pathReps : [] as PathRep[],
  _pathRoot : copyObject(DEFAULT_PATH_REP),
  _pathStack : [] as PathRep[],
  start (program : string) {
    // initialize parser so that each token acts as a transition in our SM
    this._parser.onShift = ((token : Token) => {
      // the token value is a token type... trust me :)
      try {
        this._handleToken(token);
      } catch (err) {
        console.error(`Error handling token at line ${token.startLine} column ${token.startColumn}.`);
        console.error(err);
      }
      return token;
    });

    this._parser.parse(program);
  },
  reset() {
    this._mode = RepBuilderModes.none;
    this._paramMode = RepParamModes.none;
    this._arrowMode = RepArrowModes.none;
    this._newNodeRep = copyObject(DEFAULT_NODE_REP);
    this._nodeReps = new Map<string, NodeRep>();
    this._pathRoot = copyObject(DEFAULT_PATH_REP);
    this._pathStack = [];
    this._pathReps = [];
  },
  getNodeReps() {
    return this._nodeReps;
  },
  _handleToken(token : Token) {
    if (token.type === TokenTypes.NODE_KEYWORD) {
      this._mode = RepBuilderModes.node;
      this._newNodeRep = { ...DEFAULT_NODE_REP };
    } else if (token.type === TokenTypes.PATH_KEYWORD) {
      this._mode = RepBuilderModes.path;
      this._pathRoot = copyObject(DEFAULT_PATH_REP);
      this._pathStack.push(this._pathRoot);
    } else if (token.type === TokenTypes.ROTATIONS_KEYWORD) {
      this._paramMode = RepParamModes.rot;
    } else if (token.type === TokenTypes.RADIUS_KEYWORD) {
      this._paramMode = RepParamModes.rad;
    } else if (token.type === TokenTypes.WORD) {
      if (this._mode === RepBuilderModes.node) {
        this._newNodeRep.name = token.value;
      } else if (this._mode === RepBuilderModes.path) {
        const nodeName = token.value;
        const nodeDef = this._nodeReps.get(nodeName);
        if (nodeDef) {
          const newEdge = copyObject(DEFAULT_EDGE_REP);
          this._pathStack[0].edges.unshift(newEdge);
          this._pathStack[0].edges[0].seed = nodeDef;
        } else {
          throw `Cannot find node with name "${nodeName}" at line ${token.startLine} column ${token.startColumn}`;
        }
      }
    } else if (token.type === TokenTypes.NUMBER) {
      if (this._paramMode === RepParamModes.rot) {
        this._newNodeRep.rot = parseFloat(token.value);
      } else if (this._paramMode === RepParamModes.rad) {
        this._newNodeRep.rad = parseFloat(token.value);
      }
    } else if (token.type === TokenTypes.SMALL_ARROW) {
      this._arrowMode = RepArrowModes.small;
      const pSegment = this._pathStack.shift();
      (pSegment as PathRep).edges[0].next = copyObject(DEFAULT_PATH_REP);
      const nextPSegment = pSegment?.edges[0].next;
      this._pathStack.unshift(nextPSegment as PathRep);
    } else if (token.type === TokenTypes.BIG_ARROW) {
      this._arrowMode = RepArrowModes.big;
    } else if (token.type === TokenTypes.PARAMETER_CLOSE_BRACKET) {
      this._paramMode = RepParamModes.none;
    } else if (token.type === TokenTypes.OPEN_PARENTHESES) {
      const pSegment = this._pathStack[0];
      (pSegment as PathRep).edges[0].next = copyObject(DEFAULT_PATH_REP);
      const nextPSegment = pSegment?.edges[0].next;
      this._pathStack.unshift(nextPSegment as PathRep);
    } else if (token.type === TokenTypes.CLOSE_PARENTHESES) {
      this._pathStack.shift();
      this._pathStack[0].edges.unshift(copyObject(DEFAULT_EDGE_REP));
    } else if (token.type === TokenTypes.PERIOD) {
      if (this._mode === RepBuilderModes.node) {
        this._nodeReps.set(this._newNodeRep.name, this._newNodeRep);
      } else if (this._mode === RepBuilderModes.path) {
        this._pathReps.push({ ...this._pathRoot });
        this._pathStack = [];
      }

      this._mode = RepBuilderModes.none;
    }
  }
});
