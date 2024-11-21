export {};
import { t, StateMachine } from 'typescript-fsm';

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

const parser : {
  parse : (string: string, parseOptions?: Object) => Promise<void>,
  onShift : (token: Token) => Promise<Token>,
} = require('../parser/parser.js');

export enum States {
  init,
  wordNode,
  wordPath, 
  nodeKeyword, 
  pathKeyword, 
  rotORrad,
  smcolonORbracketNode,
  rotationsKeyword, 
  radiusKeyword, 
  equalsNode, 
  openBrackets, 
  closeBrackets, 
  period,
  arrow,
  openParen,
  closeParen,
  lengthKeyword,
  angleKeyword,
  lenORphi,
  equalsPath,
  smcolonORbracketPath,
  wordORparen1,
  wordORparen2,
  periodORarrow,
  endDef,
};

const transitions = [
  t(States.init, TokenTypes.NODE_KEYWORD, States.nodeKeyword,  doNothing),
  t(States.init, TokenTypes.PATH_KEYWORD, States.pathKeyword,  doNothing),
  // Defining nodes
  t(States.nodeKeyword, TokenTypes.WORD, States.wordNode,  doNothing),
  t(States.wordNode, TokenTypes.EQUALS, States.equalsNode,  doNothing),
  // Defining node configs
  t(States.equalsNode, TokenTypes.PARAMETER_OPEN_BRACKET, States.rotORrad,  doNothing),
  t(States.rotORrad, TokenTypes.ROTATIONS_KEYWORD, States.wordNode,  doNothing),
  t(States.rotORrad, TokenTypes.RADIUS_KEYWORD, States.wordNode,  doNothing),
  t(States.equalsNode, TokenTypes.NUMBER, States.smcolonORbracketNode,  doNothing),
  t(States.smcolonORbracketNode, TokenTypes.SEMICOLON, States.rotORrad,  doNothing),
  t(States.smcolonORbracketNode, TokenTypes.PARAMETER_CLOSE_BRACKET, States.closeBrackets,  doNothing),
  t(States.closeBrackets, TokenTypes.PERIOD, States.period, doNothing),
  // Defining continuations
  t(States.period, TokenTypes.NODE_KEYWORD, States.nodeKeyword,  doNothing),
  t(States.period, TokenTypes.PATH_KEYWORD, States.pathKeyword,  doNothing),
  // Defining paths
  t(States.pathKeyword, TokenTypes.EQUALS, States.equalsPath,  doNothing),
  t(States.equalsPath, TokenTypes.WORD, States.wordPath, doNothing),
  t(States.wordPath, TokenTypes.SMALL_ARROW, States.arrow,  doNothing),
  t(States.wordPath, TokenTypes.BIG_ARROW, States.arrow,  doNothing),
  t(States.arrow, TokenTypes.PARAMETER_OPEN_BRACKET, States.lenORphi, doNothing),
  t(States.lenORphi, TokenTypes.LENGTH_KEYWORD, States.wordPath, doNothing),
  t(States.lenORphi, TokenTypes.ANGLE_KEYWORD, States.wordPath, doNothing),
  t(States.wordPath, TokenTypes.EQUALS, States.equalsPath, doNothing),
  t(States.equalsPath, TokenTypes.NUMBER, States.smcolonORbracketPath, doNothing),
  t(States.smcolonORbracketPath, TokenTypes.SEMICOLON, States.lenORphi, doNothing),
  t(States.smcolonORbracketPath, TokenTypes.PARAMETER_CLOSE_BRACKET, States.wordORparen1, doNothing),
  t(States.wordORparen1, TokenTypes.WORD, States.wordPath, doNothing),
  t(States.wordORparen1, TokenTypes.OPEN_PARENTHESES, States.wordORparen2, doNothing),
  t(States.wordORparen2, TokenTypes.WORD, States.wordPath, doNothing),
  t(States.wordORparen2, TokenTypes.OPEN_PARENTHESES, States.wordORparen2, doNothing),
  t(States.wordPath, TokenTypes.CLOSE_PARENTHESES, States.periodORarrow, doNothing),
  t(States.wordPath, TokenTypes.PERIOD, States.period, doNothing),
  t(States.periodORarrow, TokenTypes.PERIOD, States.period, doNothing),
  t(States.periodORarrow, TokenTypes.SMALL_ARROW, States.arrow, doNothing),
  t(States.periodORarrow, TokenTypes.BIG_ARROW, States.arrow, doNothing),
];

function doNothing() {}

const sm = new StateMachine<States, TokenTypes>(
  States.init,
  transitions,
);

export const repBuilder = ({
  _parser : parser,
  _sm : sm,
  _nodeReps : new Map<string, NodeRep>(),
  async start (program : string) {
    // initialize parser so that each token acts as a transition in our SM
    this._parser.onShift = (async (token : Token) => {
      // the token value is a token type... trust me :)
      await this._sm.dispatch(token.type as TokenTypes);
      return token;
    });

    await this._parser.parse(program);
  },
  getSM() {
    return this._sm;
  }
});
