export {};

import { toRad, copyObject } from '../../utils';

type Token = {
  type : string,
  value : string,
  startOffset : number,
  endOffset : number,
  startLine : number,
  endLine : number,
  startColumn : number,
  endColumn : number,
};

export type NodeRep = {
  name : string,
  rot : number,
  rad : number,
  x : number,
  y : number,
  dir : number,
  thetaStep : number,
  radiusStep : number,
  color: string,
};

export type PathRep = {
  seed : NodeRep | null,
  next : PathRep | null,
  len : number,
  theta : number,
};

const DEFAULT_NODE_NAME = '';
const DEFAULT_NODE_ROT = 0;
const DEFAULT_NODE_RADIUS = 0;
const DEFAULT_NODE_DIR = 1;
const DEFAULT_NODE_REP: NodeRep = {
  name : DEFAULT_NODE_NAME,
  rot : DEFAULT_NODE_ROT,
  rad : DEFAULT_NODE_RADIUS,
  dir : DEFAULT_NODE_DIR,
  x : 0,
  y : 0,
  thetaStep : 0.01,
  radiusStep : 0.01,
  color : '#000000'
};
const DEFAULT_PATH_REP: PathRep = {
  seed: null,
  next: null,
  len: 0,
  theta: 0,
};

enum TokenTypes {
  NODE_KEYWORD = 'NODE_KEYWORD',
  PATH_KEYWORD = 'PATH_KEYWORD',
  ENV_KEYWORD = 'ENV_KEYWORD',
  ROTATIONS_KEYWORD = 'ROTATIONS_KEYWORD',
  RADIUS_KEYWORD = 'RADIUS_KEYWORD',
  LENGTH_KEYWORD = 'LENGTH_KEYWORD',
  ANGLE_KEYWORD = 'ANGLE_KEYWORD',
  DIR_KEYWORD = 'DIR_KEYWORD',
  COLOR_KEYWORD = 'COLOR_KEYWORD',
  THETA_STEP_KEYWORD = 'THETA_STEP_KEYWORD',
  RADIUS_STEP_KEYWORD = 'RADIUS_STEP_KEYWORD',
  BIG_ARROW = 'BIG_ARROW',
  SMALL_ARROW = 'SMALL_ARROW',
  EQUALS = 'EQUALS',
  PARAMETER_OPEN_BRACKET = 'PARAMETER_OPEN_BRACKET',
  PARAMETER_CLOSE_BRACKET = 'PARAMETER_CLOSE_BRACKET',
  NUMBER = 'NUMBER',
  HEXADECIMAL = 'HEXADECIMAL',
  WORD = 'WORD',
  SEMICOLON = 'SEMICOLON',
  PERIOD = 'PERIOD',
  OPEN_PARENTHESES = 'OPEN_PARENTHESES',
  CLOSE_PARENTHESES = 'CLOSE_PARENTHESES'
}

enum RepBuilderModes {
  none,
  node,
  path,
}

enum RepParamModes {
  none,
  rot,
  rad,
  len,
  theta,
  dir,
  thetaStep,
  radiusStep,
  color,
}

enum RepArrowModes {
  none,
  small
}

const parser : {
  parse : (string: string, parseOptions?: Object) => Promise<void>,
  onShift : (token: Token) => Token | null,
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
        return token;
      } catch (err) {
        console.error(`Error handling token "${token.value}" at line ${token.startLine} column ${token.startColumn}.`);
        console.error(err);
        return null;
      }
    });

    this._parser.parse(program);
    this._placeSeeds();
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
  getPaths() {
    return this._pathReps;
  },
  _handleToken(token : Token) {
    if (token.type === TokenTypes.NODE_KEYWORD) {
      this._mode = RepBuilderModes.node;
      this._newNodeRep = { ...DEFAULT_NODE_REP };
    } else if (token.type === TokenTypes.PATH_KEYWORD) {
      this._mode = RepBuilderModes.path;
      this._pathRoot = copyObject(DEFAULT_PATH_REP);
      this._pathStack.push(this._pathRoot);
    } else if (token.type === TokenTypes.THETA_STEP_KEYWORD) {
      this._paramMode = RepParamModes.thetaStep;
    } else if (token.type === TokenTypes.RADIUS_STEP_KEYWORD) {
      this._paramMode = RepParamModes.radiusStep;
    } else if (token.type === TokenTypes.ROTATIONS_KEYWORD) {
      this._paramMode = RepParamModes.rot;
    } else if (token.type === TokenTypes.RADIUS_KEYWORD) {
      this._paramMode = RepParamModes.rad;
    } else if (token.type === TokenTypes.LENGTH_KEYWORD) {
      this._paramMode = RepParamModes.len;
    } else if (token.type === TokenTypes.ANGLE_KEYWORD) {
      this._paramMode = RepParamModes.theta;
    } else if (token.type === TokenTypes.DIR_KEYWORD) {
      this._paramMode = RepParamModes.dir;
    } else if (token.type === TokenTypes.COLOR_KEYWORD) {
      this._paramMode = RepParamModes.color;
    } else if (token.type === TokenTypes.WORD) {
      if (this._mode === RepBuilderModes.node) {
        this._newNodeRep.name = token.value;
      } else if (this._mode === RepBuilderModes.path) {
        const nodeName = token.value;
        const nodeDef = copyObject(this._nodeReps.get(nodeName));
        if (nodeDef) {
          this._pathStack[0].seed = nodeDef;
        } else {
          throw `Cannot find node with name "${nodeName}" at line ${token.startLine} column ${token.startColumn}`;
        }
      }
    } else if (token.type === TokenTypes.NUMBER) {
      if (this._paramMode === RepParamModes.rot) {
        this._newNodeRep.rot = parseFloat(token.value);
      } else if (this._paramMode === RepParamModes.rad) {
        this._newNodeRep.rad = parseFloat(token.value);
      } else if (this._paramMode === RepParamModes.dir) {
        this._newNodeRep.dir = parseInt(token.value);
      } else if (this._paramMode === RepParamModes.len) {
        this._pathStack[0].len = parseFloat(token.value);
      } else if (this._paramMode === RepParamModes.theta) {
        this._pathStack[0].theta = parseFloat(token.value);
      } else if (this._paramMode === RepParamModes.thetaStep) {
        this._newNodeRep.thetaStep = parseFloat(token.value);
      } else if (this._paramMode === RepParamModes.radiusStep) {
        this._newNodeRep.radiusStep = parseFloat(token.value);
      }
    } else if (token.type === TokenTypes.HEXADECIMAL) {
      this._newNodeRep.color = token.value;
    } else if (token.type === TokenTypes.SMALL_ARROW) {
      this._arrowMode = RepArrowModes.small;
      const segment = this._pathStack.shift() as PathRep;
      segment.next = copyObject(DEFAULT_PATH_REP);
      const nextSegment = segment.next;
      this._pathStack.unshift(nextSegment);
    } else if (token.type === TokenTypes.PARAMETER_CLOSE_BRACKET) {
      this._paramMode = RepParamModes.none;
    } else if (token.type === TokenTypes.PERIOD) {
      if (this._mode === RepBuilderModes.node) {
        this._nodeReps.set(this._newNodeRep.name, this._newNodeRep);
      } else if (this._mode === RepBuilderModes.path) {
        this._pathReps.push({ ...this._pathRoot });
        this._pathStack = [];
      }
      this._mode = RepBuilderModes.none;
    }
  },
  /**
   * Place seeds on the 2D plane
   */
  _placeSeeds() {
    this._pathReps.forEach(pathRep => {
      let currSegment : PathRep | null = pathRep;
      let lastX = 0;
      let lastY = 0;

      while (currSegment !== null) {        
        const x = Math.cos(toRad(currSegment.theta)) * currSegment.len + lastX;
        const y = Math.sin(toRad(currSegment.theta)) * currSegment.len + lastY;

        lastX = x;
        lastY = y;

        (currSegment.seed as NodeRep).x = x;
        (currSegment.seed as NodeRep).y = y;

        currSegment = currSegment.next;
      }
    });
  }
});
