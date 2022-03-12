import * as  jscodeshift from 'jscodeshift';

export function setKeyQuoteUsage(ast, enabled) {
  return jscodeshift(ast.toSource())
    .find(jscodeshift.ObjectExpression)
    .forEach(path => {
      path.value.properties.forEach(prop => {
        if (enabled) {
          quoteKey(prop)
        } else {
          unquoteKey(prop)
        }
      })
    })
}

function quoteKey(prop) {
  if (prop.key.type === 'Identifier') {
    prop.key = jscodeshift.literal(prop.key.name)
  }
}

function unquoteKey(prop) {
  if (prop.key.type === 'Literal') {
    prop.key = jscodeshift.identifier(prop.key.value)
  }
}
