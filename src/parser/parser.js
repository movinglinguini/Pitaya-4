/**
 * LR parser generated by the Syntax tool.
 *
 * https://www.npmjs.com/package/syntax-cli
 *
 *   npm install -g syntax-cli
 *
 *   syntax-cli --help
 *
 * To regenerate run:
 *
 *   syntax-cli \
 *     --grammar ~/path-to-grammar-file \
 *     --mode <parsing-mode> \
 *     --output ~/path-to-output-parser-file.js
 */

'use strict';

/**
 * Matched token text.
 */
let yytext;

/**
 * Length of the matched token text.
 */
let yyleng;

/**
 * Storage object.
 */
let yy = {};

/**
 * Result of semantic action.
 */
let __;

/**
 * Result location object.
 */
let __loc;

function yyloc(start, end) {
  if (!yy.options.captureLocations) {
    return null;
  }

  // Epsilon doesn't produce location.
  if (!start || !end) {
    return start || end;
  }

  return {
    startOffset: start.startOffset,
    endOffset: end.endOffset,
    startLine: start.startLine,
    endLine: end.endLine,
    startColumn: start.startColumn,
    endColumn: end.endColumn,
  };
}

const EOF = '$';

/**
 * List of productions (generated by Syntax tool).
 */
const productions = [[-1,1,(_1) => { __ = _1 }],
[0,1,(_1) => { __ = _1 }],
[0,1,(_1) => { __ = _1 }],
[1,2],
[1,2],
[1,1,(_1) => { __ = _1 }],
[2,7],
[3,3],
[3,3],
[3,3],
[3,3],
[3,3],
[3,3],
[4,4],
[5,1,(_1) => { __ = _1 }],
[5,2],
[6,5],
[7,3],
[7,3],
[7,3],
[7,3]];

/**
 * Encoded tokens map.
 */
const tokens = {"PERIOD":"8","NODE_KEYWORD":"9","WORD":"10","EQUALS":"11","PARAMETER_OPEN_BRACKET":"12","PARAMETER_CLOSE_BRACKET":"13","SEMICOLON":"14","RADIUS_KEYWORD":"15","NUMBER":"16","ROTATIONS_KEYWORD":"17","THETA_STEP_KEYWORD":"18","RADIUS_STEP_KEYWORD":"19","COLOR_KEYWORD":"20","HEXADECIMAL":"21","PATH_KEYWORD":"22","SMALL_ARROW":"23","DIR_KEYWORD":"24","LENGTH_KEYWORD":"25","ANGLE_KEYWORD":"26","$":"27"};

/**
 * Parsing table (generated by Syntax tool).
 */
const table = [{"0":1,"2":2,"4":3,"9":"s4","22":"s5"},{"27":"acc"},{"27":"r1"},{"27":"r2"},{"10":"s6"},{"11":"s21"},{"11":"s7"},{"12":"s8"},{"3":9,"15":"s10","17":"s11","18":"s12","19":"s13","20":"s14"},{"13":"s15","14":"s16"},{"11":"s43"},{"11":"s45"},{"11":"s47"},{"11":"s49"},{"11":"s51"},{"1":17,"8":"s18"},{"3":42,"15":"s10","17":"s11","18":"s12","19":"s13","20":"s14"},{"27":"r6"},{"2":19,"4":20,"9":"s4","22":"s5","27":"r5"},{"27":"r3"},{"27":"r4"},{"5":22,"10":"s23"},{"1":24,"8":"s18"},{"6":25,"8":"r14","23":"s26"},{"27":"r13"},{"8":"r15"},{"12":"s27"},{"7":28,"24":"s29","25":"s30","26":"s31"},{"13":"s32","14":"s33"},{"11":"s36"},{"11":"s38"},{"11":"s40"},{"5":34,"10":"s23"},{"7":35,"24":"s29","25":"s30","26":"s31"},{"8":"r16"},{"13":"r17","14":"r17"},{"16":"s37"},{"13":"r18","14":"r18"},{"16":"s39"},{"13":"r19","14":"r19"},{"16":"s41"},{"13":"r20","14":"r20"},{"13":"r7","14":"r7"},{"16":"s44"},{"13":"r8","14":"r8"},{"16":"s46"},{"13":"r9","14":"r9"},{"16":"s48"},{"13":"r10","14":"r10"},{"16":"s50"},{"13":"r11","14":"r11"},{"21":"s52"},{"13":"r12","14":"r12"}];

/**
 * Parsing stack.
 */
const stack = [];

/**
 * Tokenizer instance.
 */
let tokenizer;
/**
 * Generic tokenizer used by the parser in the Syntax tool.
 *
 * https://www.npmjs.com/package/syntax-cli
 *
 * See `--custom-tokinzer` to skip this generation, and use a custom one.
 */

const lexRules = [[/^\s+/, function() { /* skip whitespace */ }],
[/^\^--(\s*\w*)*/, function() { return 'COMMENT' }],
[/^node/, function() { return 'NODE_KEYWORD' }],
[/^path/, function() { return 'PATH_KEYWORD' }],
[/^rot/, function() { return 'ROTATIONS_KEYWORD' }],
[/^thetaStep/, function() { return 'THETA_STEP_KEYWORD' }],
[/^radiusStep/, function() { return 'RADIUS_STEP_KEYWORD' }],
[/^rad/, function() { return 'RADIUS_KEYWORD' }],
[/^len/, function() { return 'LENGTH_KEYWORD' }],
[/^theta/, function() { return 'ANGLE_KEYWORD' }],
[/^dir/, function() { return 'DIR_KEYWORD' }],
[/^env/, function() { return 'ENV_KEYWORD' }],
[/^color/, function() { return 'COLOR_KEYWORD' }],
[/^\#[a-fA-F0-9]{3,8}/, function() { return 'HEXADECIMAL' }],
[/^(\=\>)/, function() { return 'BIG_ARROW' }],
[/^(\-\>)/, function() { return 'SMALL_ARROW' }],
[/^(\=)/, function() { return 'EQUALS' }],
[/^(\[)/, function() { return 'PARAMETER_OPEN_BRACKET' }],
[/^(\])/, function() { return 'PARAMETER_CLOSE_BRACKET' }],
[/^\-*\d+\.*\d*/, function() { return 'NUMBER' }],
[/^\w+/, function() { return 'WORD' }],
[/^\;/, function() { return 'SEMICOLON' }],
[/^\./, function() { return 'PERIOD' }],
[/^\(/, function() { return 'OPEN_PARENTHESES' }],
[/^\)/, function() { return 'CLOSE_PARENTHESES' }]];
const lexRulesByConditions = {"INITIAL":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]};

const EOF_TOKEN = {
  type: EOF,
  value: '',
};

tokenizer = {
  initString(string) {
    this._string = string;
    this._cursor = 0;

    this._states = ['INITIAL'];
    this._tokensQueue = [];

    this._currentLine = 1;
    this._currentColumn = 0;
    this._currentLineBeginOffset = 0;

    /**
     * Matched token location data.
     */
    this._tokenStartOffset = 0;
    this._tokenEndOffset = 0;
    this._tokenStartLine = 1;
    this._tokenEndLine = 1;
    this._tokenStartColumn = 0;
    this._tokenEndColumn = 0;

    return this;
  },

  /**
   * Returns tokenizer states.
   */
  getStates() {
    return this._states;
  },

  getCurrentState() {
    return this._states[this._states.length - 1];
  },

  pushState(state) {
    this._states.push(state);
  },

  begin(state) {
    this.pushState(state);
  },

  popState() {
    if (this._states.length > 1) {
      return this._states.pop();
    }
    return this._states[0];
  },

  getNextToken() {
    // Something was queued, return it.
    if (this._tokensQueue.length > 0) {
      return this.onToken(this._toToken(this._tokensQueue.shift()));
    }

    if (!this.hasMoreTokens()) {
      return this.onToken(EOF_TOKEN);
    }

    let string = this._string.slice(this._cursor);
    let lexRulesForState = lexRulesByConditions[this.getCurrentState()];

    for (let i = 0; i < lexRulesForState.length; i++) {
      let lexRuleIndex = lexRulesForState[i];
      let lexRule = lexRules[lexRuleIndex];

      let matched = this._match(string, lexRule[0]);

      // Manual handling of EOF token (the end of string). Return it
      // as `EOF` symbol.
      if (string === '' && matched === '') {
        this._cursor++;
      }

      if (matched !== null) {
        yytext = matched;
        yyleng = yytext.length;
        let token = lexRule[1].call(this);

        if (!token) {
          return this.getNextToken();
        }

        // If multiple tokens are returned, save them to return
        // on next `getNextToken` call.

        if (Array.isArray(token)) {
          const tokensToQueue = token.slice(1);
          token = token[0];
          if (tokensToQueue.length > 0) {
            this._tokensQueue.unshift(...tokensToQueue);
          }
        }

        return this.onToken(this._toToken(token, yytext));
      }
    }

    if (this.isEOF()) {
      this._cursor++;
      return EOF_TOKEN;
    }

    this.throwUnexpectedToken(
      string[0],
      this._currentLine,
      this._currentColumn
    );
  },

  /**
   * Throws default "Unexpected token" exception, showing the actual
   * line from the source, pointing with the ^ marker to the bad token.
   * In addition, shows `line:column` location.
   */
  throwUnexpectedToken(symbol, line, column) {
    const lineSource = this._string.split('\n')[line - 1];
    let lineData = '';

    if (lineSource) {
      const pad = ' '.repeat(column);
      lineData = '\n\n' + lineSource + '\n' + pad + '^\n';
    }

    throw new SyntaxError(
      `${lineData}Unexpected token: "${symbol}" ` +
      `at ${line}:${column}.`
    );
  },

  getCursor() {
    return this._cursor;
  },

  getCurrentLine() {
    return this._currentLine;
  },

  getCurrentColumn() {
    return this._currentColumn;
  },

  _captureLocation(matched) {
    const nlRe = /\n/g;

    // Absolute offsets.
    this._tokenStartOffset = this._cursor;

    // Line-based locations, start.
    this._tokenStartLine = this._currentLine;
    this._tokenStartColumn =
      this._tokenStartOffset - this._currentLineBeginOffset;

    // Extract `\n` in the matched token.
    let nlMatch;
    while ((nlMatch = nlRe.exec(matched)) !== null) {
      this._currentLine++;
      this._currentLineBeginOffset = this._tokenStartOffset + nlMatch.index + 1;
    }

    this._tokenEndOffset = this._cursor + matched.length;

    // Line-based locations, end.
    this._tokenEndLine = this._currentLine;
    this._tokenEndColumn = this._currentColumn =
      (this._tokenEndOffset - this._currentLineBeginOffset);
  },

  _toToken(tokenType, yytext = '') {
    return {
      // Basic data.
      type: tokenType,
      value: yytext,

      // Location data.
      startOffset: this._tokenStartOffset,
      endOffset: this._tokenEndOffset,
      startLine: this._tokenStartLine,
      endLine: this._tokenEndLine,
      startColumn: this._tokenStartColumn,
      endColumn: this._tokenEndColumn,
    };
  },

  isEOF() {
    return this._cursor === this._string.length;
  },

  hasMoreTokens() {
    return this._cursor <= this._string.length;
  },

  _match(string, regexp) {
    let matched = string.match(regexp);
    if (matched) {
      // Handle `\n` in the matched token to track line numbers.
      this._captureLocation(matched[0]);
      this._cursor += matched[0].length;
      return matched[0];
    }
    return null;
  },

  /**
   * Allows analyzing, and transforming token. Default implementation
   * just passes the token through.
   */
  onToken(token) {
    return token;
  },
};

/**
 * Expose tokenizer so it can be accessed in semantic actions.
 */
yy.lexer = tokenizer;
yy.tokenizer = tokenizer;

/**
 * Global parsing options. Some options can be shadowed per
 * each `parse` call, if the optations are passed.
 *
 * Initalized to the `captureLocations` which is passed
 * from the generator. Other options can be added at runtime.
 */
yy.options = {
  captureLocations: false,
};

/**
 * Parsing module.
 */
const yyparse = {
  /**
   * Sets global parsing options.
   */
  setOptions(options) {
    yy.options = options;
    return this;
  },

  /**
   * Returns parsing options.
   */
  getOptions() {
    return yy.options;
  },

  /**
   * Parses a string.
   */
  parse(string, parseOptions) {
    if (!tokenizer) {
      throw new Error(`Tokenizer instance wasn't specified.`);
    }

    tokenizer.initString(string);

    /**
     * If parse options are passed, override global parse options for
     * this call, and later restore global options.
     */
    let globalOptions = yy.options;
    if (parseOptions) {
      yy.options = Object.assign({}, yy.options, parseOptions);
    }

    /**
     * Allow callers to do setup work based on the
     * parsing string, and passed options.
     */
    yyparse.onParseBegin(string, tokenizer, yy.options);

    stack.length = 0;
    stack.push(0);

    let token = tokenizer.getNextToken();
    let shiftedToken = null;

    do {
      if (!token) {
        // Restore options.
        yy.options = globalOptions;
        unexpectedEndOfInput();
      }

      let state = stack[stack.length - 1];
      let column = tokens[token.type];

      if (!table[state].hasOwnProperty(column)) {
        yy.options = globalOptions;
        unexpectedToken(token);
      }

      let entry = table[state][column];

      // Shift action.
      if (entry[0] === 's') {
        let loc = null;

        if (yy.options.captureLocations) {
          loc = {
            startOffset: token.startOffset,
            endOffset: token.endOffset,
            startLine: token.startLine,
            endLine: token.endLine,
            startColumn: token.startColumn,
            endColumn: token.endColumn,
          };
        }

        shiftedToken = this.onShift(token);

        stack.push(
          {symbol: tokens[shiftedToken.type], semanticValue: shiftedToken.value, loc},
          Number(entry.slice(1))
        );

        token = tokenizer.getNextToken();
      }

      // Reduce action.
      else if (entry[0] === 'r') {
        let productionNumber = entry.slice(1);
        let production = productions[productionNumber];
        let hasSemanticAction = typeof production[2] === 'function';
        let semanticValueArgs = hasSemanticAction ? [] : null;

        const locationArgs = (
          hasSemanticAction && yy.options.captureLocations
            ? []
            : null
        );

        if (production[1] !== 0) {
          let rhsLength = production[1];
          while (rhsLength-- > 0) {
            stack.pop();
            let stackEntry = stack.pop();

            if (hasSemanticAction) {
              semanticValueArgs.unshift(stackEntry.semanticValue);

              if (locationArgs) {
                locationArgs.unshift(stackEntry.loc);
              }
            }
          }
        }

        const reduceStackEntry = {symbol: production[0]};

        if (hasSemanticAction) {
          yytext = shiftedToken ? shiftedToken.value : null;
          yyleng = shiftedToken ? shiftedToken.value.length : null;

          const semanticActionArgs = (
            locationArgs !== null
              ? semanticValueArgs.concat(locationArgs)
              : semanticValueArgs
          );

          production[2](...semanticActionArgs);

          reduceStackEntry.semanticValue = __;

          if (locationArgs) {
            reduceStackEntry.loc = __loc;
          }
        }

        const nextState = stack[stack.length - 1];
        const symbolToReduceWith = production[0];

        stack.push(
          reduceStackEntry,
          table[nextState][symbolToReduceWith]
        );
      }

      // Accept.
      else if (entry === 'acc') {
        stack.pop();
        let parsed = stack.pop();

        if (stack.length !== 1 ||
            stack[0] !== 0 ||
            tokenizer.hasMoreTokens()) {
          // Restore options.
          yy.options = globalOptions;
          unexpectedToken(token);
        }

        if (parsed.hasOwnProperty('semanticValue')) {
          yy.options = globalOptions;
          yyparse.onParseEnd(parsed.semanticValue);
          return parsed.semanticValue;
        }

        yyparse.onParseEnd();

        // Restore options.
        yy.options = globalOptions;
        return true;
      }

    } while (tokenizer.hasMoreTokens() || stack.length > 1);
  },

  setTokenizer(customTokenizer) {
    tokenizer = customTokenizer;
    return yyparse;
  },

  getTokenizer() {
    return tokenizer;
  },

  onParseBegin(string, tokenizer, options) {},
  onParseEnd(parsed) {},

  /**
   * Allows analyzing, and transforming shifted token. Default implementation
   * just passes the token through.
   */
  onShift(token) {
    return token;
  },
};



function unexpectedToken(token) {
  if (token.type === EOF) {
    unexpectedEndOfInput();
  }

  tokenizer.throwUnexpectedToken(
    token.value,
    token.startLine,
    token.startColumn
  );
}

function unexpectedEndOfInput() {
  parseError(`Unexpected end of input.`);
}

function parseError(message) {
  throw new SyntaxError(message);
}

module.exports = yyparse;
