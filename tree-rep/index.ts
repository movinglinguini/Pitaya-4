export {};
import { t, StateMachine } from 'typescript-fsm';

const DEFAULT_NODE_NAME = '';
const DEFAULT_NODE_ROT = 0;
const DEFAULT_NODE_RADIUS = 0;
const DEFAULT_NODE_REP = {
  name : DEFAULT_NODE_NAME,
  rot : DEFAULT_NODE_ROT,
  rad : DEFAULT_NODE_RADIUS
};

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

type PathRep = {
  edges : {
    len : number,
    phi : number,
    next : PathRep,
    to : NodeRep,
  }[]
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

const parser : {
  parse : (string: string, parseOptions?: Object) => Promise<void>,
  onShift : (token: Token) => Token,
} = require('../parser/parser.js');

export const repBuilder = ({
  _parser : parser,
  _mode : RepBuilderModes.none,
  _paramMode : RepParamModes.none,
  _newNodeRep : { ...DEFAULT_NODE_REP },
  _nodeReps : new Map<string, NodeRep>(),
  _pathReps : [] as PathRep[],
  start (program : string) {
    // initialize parser so that each token acts as a transition in our SM
    this._parser.onShift = ((token : Token) => {
      // the token value is a token type... trust me :)
      this._handleToken(token);
      return token;
    });

    this._parser.parse(program);
  },
  reset() {
    this._mode = RepBuilderModes.none;
    this._paramMode = RepParamModes.none;
    this._newNodeRep = { ...DEFAULT_NODE_REP };
    this._nodeReps = new Map<string, NodeRep>();
  },
  getNodeReps() {
    return this._nodeReps;
  },
  _handleToken(token : Token) {
    if (token.type === TokenTypes.NODE_KEYWORD) {
      this._mode = RepBuilderModes.node;
      this._newNodeRep = {
        name: DEFAULT_NODE_NAME,
        rot : DEFAULT_NODE_ROT,
        rad : DEFAULT_NODE_RADIUS,
      }
    } else if (token.type === TokenTypes.ROTATIONS_KEYWORD) {
      this._paramMode = RepParamModes.rot;
    } else if (token.type === TokenTypes.RADIUS_KEYWORD) {
      this._paramMode = RepParamModes.rad;
    } else if (token.type === TokenTypes.WORD) {
      if (this._mode === RepBuilderModes.node) {
        this._newNodeRep.name = token.value;
      }
    } else if (token.type === TokenTypes.NUMBER) {
      if (this._paramMode === RepParamModes.rot) {
        this._newNodeRep.rot = parseFloat(token.value);
      } else if (this._paramMode === RepParamModes.rad) {
        this._newNodeRep.rad = parseFloat(token.value);
      }
    } else if (token.type === TokenTypes.PARAMETER_CLOSE_BRACKET) {
      this._paramMode = RepParamModes.none;
      if (this._mode === RepBuilderModes.node) {
        this._nodeReps.set(this._newNodeRep.name, this._newNodeRep);
      }
    } else if (token.type === TokenTypes.PERIOD) {
      this._mode = RepBuilderModes.none;
    }
  }
});
