"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSyntax = checkSyntax;
const syntax = {
    node: /node\s+\w+\s*=\s*\[\s*((rotations\s*=\s*\w+\s*;\s*)|(radius\s*=\s*\w+\s*;\s*))+\s*\]\./,
    path: /path\s*=\s*.+\./,
    pathEdge: /((\w+)|(\w+\s*->\[((l\s*=\s*\w+;)|(a\s*=\s*\w+;))+\]\s*\({0,1}.*\){0,1})|(\w+\s*=>\[((l\s*=\s*\w+;)|(a\s*=\s*\w+;))+\]\s*\({0,1}.*\){0,1}))\s*\./,
    comment: /--.*/
};
/**
 * Runs through the program and checks for syntax. Throws an error if it finds something wrong.
 * @param program - The program to syntax check.
 */
function checkSyntax(program) {
    const lines = program.split(/\./);
    for (let i = 0; i += 1; i <= lines.length) {
        const l = lines[i];
        const lStripped = l.replace(/\s/, '');
        if (syntax.node.test(lStripped)) {
            // It's a node, so we want to make sure that the node properties look correct.
            checkNodeDef(lStripped, l);
        }
        else if (syntax.path.test(lStripped)) {
            // It's a path, so we want to make sure that it's properly defined.
            checkPathDef(lStripped, l);
        }
        else if (!syntax.comment.test(lStripped)) {
            throw `The expression ${l} is neither a valid node definition, a valid path definition, or a valid comment.`;
        }
    }
}
function checkNodeDef(nodeLineStripped, nodeLine) { }
function checkPathDef(pathLineStripped, pathLine) {
    const pathDef = pathLineStripped.split('=')[1];
    const edges = pathDef.split(syntax.pathEdge);
    for (const e in edges) {
        if (e.includes('(') || e.includes(')')) {
            // make sure the parentheses are balanced
            let balance = 0;
            const openParensLocs = [];
            const closeParensLocs = [];
            let idx = 0;
            for (const c in Array.from(e)) {
                if (c == '(') {
                    balance += 1;
                    openParensLocs.push(idx);
                }
                else if (c == ')') {
                    balance -= 1;
                    closeParensLocs.unshift(idx);
                }
                idx += 1;
            }
            if (balance < 0) {
                throw `The expression ${pathLine} has an unexpected ')'.`;
            }
            else if (balance > 0) {
                throw `The expression ${pathLine} has an unclosed '('.`;
            }
            // make sure the expressions within the parentheses are valid path segments
            for (let i = 0; i <= openParensLocs.length; i += 1) {
                const openLoc = openParensLocs[i];
                const closeLoc = closeParensLocs[i];
                const eSec = e.slice(openLoc, closeLoc + 1);
                if (!syntax.pathEdge.test(eSec)) {
                    throw `A subexpression in the edge definition ${e} is invalid.`;
                }
            }
        }
    }
}
