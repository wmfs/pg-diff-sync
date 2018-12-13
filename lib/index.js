const statementGenerators = require('./statement-generators/index')

const TYPES = [
  'schema',
  'schemaComment',
  'table',
  'tableComment',
  'column',
  'columnComment',
  'pkColumnNames',
  'index',
  'fkConstraint',
  'view'
]

const processStructures = require('./process-structures')

function dbDiff (baseDbStructure, targetDbStructure) {
  const processed = processStructures(baseDbStructure, targetDbStructure)

  const statements = []

  TYPES.forEach(typeName => {
    for (const componentId in processed[typeName]) {
      const component = processed[typeName][componentId]
      if (component) {
        statementGenerators[typeName](componentId, component, statements)
      } // if ...
    } // for ...
  })

  return statements
}

const isChange = /^ALTER TABLE(.+)ALTER(.*)$/

function stripCreates (statements) {
  return statements.filter(statement => isChange.test(statement))
} // stripCreates

function stripChanges (statements) {
  return statements.filter(statement => !isChange.test(statement))
} // stripChanges

module.exports = function (baseDbStructure, targetDbStructure, options = { }) {
  let statements = dbDiff(baseDbStructure, targetDbStructure)

  const { includeCreates = true, includeChanges = true } = options
  if (!includeCreates) {
    statements = stripCreates(statements)
  }
  if (!includeChanges) {
    statements = stripChanges(statements)
  }

  return statements
}