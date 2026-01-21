import * as jscodeshift from 'jscodeshift';
import { writeValue } from './writeValue';
import { setKeyQuoteUsage } from './setKeyQuoteUsage';

export namespace JSON5EditorExampleNamespace {
  export type AST = jscodeshift.Collection<
    jscodeshift.ObjectExpression | jscodeshift.ArrayExpression
  >;

  //#region @browser
  export type ASTBrowser = jscodeshift.Collection<
    jscodeshift.ObjectExpression | jscodeshift.ArrayExpression
  >;
  //#endregion

  //#region @backend
  export interface LoadResult {
    write: (value: Object | Array<any>) => void;
    toSource: (options?: any) => string;
    toJSON: (options?: any) => string;
    ast: AST;
  }
  //#endregion
}

export function load(src) {
  const ast = toAst(src);
  const root = ast.nodes()[0].program.body[0].expression;

  // @param {Object|Array} value
  function write(value) {
    root.right = writeValue(root.right, value);
  }

  function toSource(options = {} as any) {
    // set default options
    options = Object.assign(
      {
        quote: 'single',
        trailingComma: true,
      },
      options,
    );

    const sourceAst =
      options.quoteKeys === undefined
        ? ast // @ts-ignore
        : setKeyQuoteUsage(ast, options.quoteKeys);

    // strip the "x=" prefix
    return sourceAst.toSource(options).replace(/^x=([{\[])/m, '$1');
  }

  function toJSON(options = {}) {
    return toSource(
      Object.assign(
        {
          quote: 'double',
          trailingComma: false,
          quoteKeys: true,
        },
        options,
      ),
    );
  }

  return { write, toSource, toJSON, ast: jscodeshift(root.right) };
}

function toAst(src) {
  // find the start of the outermost array or object
  const expressionStart = src.match(/^\s*[{\[]/m);
  if (expressionStart) {
    // hackily insert "x=" so the JSON5 becomes valid JavaScript
    const astSrc = src.replace(/^\s*([{\[])/m, 'x=$1');
    return jscodeshift(astSrc);
  }

  // no array or object exist in the JSON5
  return jscodeshift('x={}');
}
