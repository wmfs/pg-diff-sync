const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const ejs = require('ejs')
const isDifferent = require('../is-different')
const missingTemplateString = fs.readFileSync(path.resolve(__dirname, './missing-template.ejs')).toString()
const missingTemplate = ejs.compile(missingTemplateString, {})
const typeTemplateString = fs.readFileSync(path.resolve(__dirname, './type-template.ejs')).toString()
const typeTemplate = ejs.compile(typeTemplateString, {})
const nullableTemplateString = fs.readFileSync(path.resolve(__dirname, './nullable-template.ejs')).toString()
const nullableTemplate = ejs.compile(nullableTemplateString, {})

function buildConstraint (target) {
  let constraint = target.dataType

  if (_.isNumber(target.numericScale) && target.numericScale > 0) {
    constraint += `(${(target.numericPrecision || 9) + target.numericScale}, ${target.numericScale})`
  }

  if (target.array) {
    constraint += '[]'
  }

  if (target.isNullable === 'NO') {
    constraint += ' NOT NULL'
  }
  if (target.columnDefault) {
    constraint += ' DEFAULT ' + target.columnDefault
  }
  return constraint
}

function buildType (target, columnName) {
  let type = target.dataType

  if (_.isNumber(target.numericScale) && target.numericScale > 0) {
    type += `(${(target.numericPrecision || 9) + target.numericScale}, ${target.numericScale})`
  }

  if (target.array) {
    type += `[] USING ${columnName}::${target.dataType}[]`
  }

  if (target.dataType === 'jsonb') {
    type += ` USING ${columnName}::jsonb`
  }

  return type
}

function buildNullable (target) {
  return `${target.isNullable === 'NO' ? 'SET' : 'DROP'} NOT NULL`
}

module.exports = function columnStatementGenerator (columnId, column, statements) {
  const parts = columnId.split('.')
  const columnName = parts[2]

  const ctx = {
    columnName: columnName,
    tableId: parts[0] + '.' + parts[1],
    constraint: buildConstraint(column.target),
    type: buildType(column.target, columnName),
    nullable: buildNullable(column.target)
  }

  if (_.isUndefined(column.base)) {
    statements.push(
      missingTemplate(ctx)
    )
    return
  }

  if (
    isDifferent(column.target.array, column.base.array) ||
    isDifferent(column.target.dataType, column.base.dataType)
  ) {
    statements.push(
      typeTemplate(ctx)
    )
  }
  if (
    isDifferent(column.target.isNullable, column.base.isNullable)
  ) {
    statements.push(
      nullableTemplate(ctx)
    )
  }
}
