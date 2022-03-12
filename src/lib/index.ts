import * as  j from 'jscodeshift';
import * as  writeValue from './writeValue';
import * as setKeyQuoteUsage from './setKeyQuoteUsage';

export function load(src) {
  const ast = toAst(src)
  const root = ast.nodes()[0].program.body[0].expression

  // @param {Object|Array} value
  function write(value) {
    // @ts-ignore
    root.right = writeValue(root.right, value)
  }

  function toSource(options = {}) {
    // set default options
    options = Object.assign(
      {
        quote: 'single',
        trailingComma: true,
      },
      options
    )

    // @ts-ignore
    const sourceAst = (options.quoteKeys === undefined)
      ? ast // @ts-ignore
      : setKeyQuoteUsage(ast, options.quoteKeys)

    // strip the "x=" prefix
    return sourceAst.toSource(options).replace(/^x=([{\[])/m, '$1')
  }

  function toJSON(options = {}) {
    return toSource(
      Object.assign(
        {
          quote: 'double',
          trailingComma: false,
          quoteKeys: true
        },
        options
      )
    )
  }

  return { write, toSource, toJSON, ast: j(root.right) }
}

function toAst(src) {
  // find the start of the outermost array or object
  const expressionStart = src.match(/^\s*[{\[]/m)
  if (expressionStart) {
    // hackily insert "x=" so the JSON5 becomes valid JavaScript
    const astSrc = src.replace(/^\s*([{\[])/m, 'x=$1')
    return j(astSrc)
  }

  // no array or object exist in the JSON5
  return j('x={}')
}
