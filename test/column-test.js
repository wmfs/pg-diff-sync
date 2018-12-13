/* eslint-env mocha */

const executionWithJson = require('./fixtures/execution-with-json.json')
const executionWithString = require('./fixtures/execution-with-string.json')
const executionWithAdditionalColumn = require('./fixtures/execution-with-additional-column.json')

const pgDiffSync = require('./../lib')
const expect = require('chai').expect

describe('columns', () => {
  it('add a column', () => {
    const statements = pgDiffSync(executionWithJson, executionWithAdditionalColumn)
    expect(statements).to.eql(
      [
        'ALTER TABLE pg_diff_sync_test.execution ADD COLUMN additional text NOT NULL;'
      ]
    )
  })

  it('remove a column', () => {
    const statements = pgDiffSync(executionWithAdditionalColumn, executionWithJson)
    expect(statements).to.eql(
      [
        // We don't actually remove it
      ]
    )
  })

  it('change column types', () => {
    const statements = pgDiffSync(executionWithJson, executionWithString)
    expect(statements).to.eql(
      [
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN ctx TYPE text;',
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN ctx DROP NOT NULL;',
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN executionOptions TYPE text;',
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN executionOptions DROP NOT NULL;'
      ]
    )
  })

  it('change column type, add another column', () => {
    const statements = pgDiffSync(executionWithString, executionWithAdditionalColumn)
    expect(statements).to.eql(
      [
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN ctx TYPE jsonb USING ctx::jsonb;',
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN ctx SET NOT NULL;',
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN executionOptions TYPE jsonb USING executionOptions::jsonb;',
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN executionOptions SET NOT NULL;',
        'ALTER TABLE pg_diff_sync_test.execution ADD COLUMN additional text NOT NULL;'
      ]
    )
  })

  it('change column type, add another column - change only', () => {
    const statements = pgDiffSync(executionWithString, executionWithAdditionalColumn, { includeCreates: false })
    expect(statements).to.eql(
      [
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN ctx TYPE jsonb USING ctx::jsonb;',
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN ctx SET NOT NULL;',
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN executionOptions TYPE jsonb USING executionOptions::jsonb;',
        'ALTER TABLE pg_diff_sync_test.execution ALTER COLUMN executionOptions SET NOT NULL;'
      ]
    )
  })

  it('change column type, add another column - create only', () => {
    const statements = pgDiffSync(executionWithString, executionWithAdditionalColumn, { includeChanges: false })
    expect(statements).to.eql(
      [
        'ALTER TABLE pg_diff_sync_test.execution ADD COLUMN additional text NOT NULL;'
      ]
    )
  })

})
