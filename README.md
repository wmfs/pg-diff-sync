# pg-diff-sync
[![Tymly Package](https://img.shields.io/badge/tymly-package-blue.svg)](https://tymly.io/)
[![npm (scoped)](https://img.shields.io/npm/v/@wmfs/pg-diff-sync.svg)](https://www.npmjs.com/package/@wmfs/pg-diff-sync)
[[![CircleCI](https://circleci.com/gh/wmfs/pg-diff-sync.svg?style=svg)](https://circleci.com/gh/wmfs/pg-diff-sync)
[![codecov](https://codecov.io/gh/wmfs/pg-diff-sync/branch/master/graph/badge.svg)](https://codecov.io/gh/wmfs/pg-diff-sync)
[![CodeFactor](https://www.codefactor.io/repository/github/wmfs/pg-diff-sync/badge)](https://www.codefactor.io/repository/github/wmfs/pg-diff-sync)
[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wmfs/tymly/blob/master/packages/pg-concat/LICENSE)



	
> Takes two objects that describe the structure of a database and produces the PostgreSQL statements required to get from one to the other.

## <a name="install"></a>Install
```bash
$ npm install pg-diff-sync --save
```

## <a name="usage"></a>Usage

```javascript
  const pgDiffSync = require('pg-diff-sync')
  const currentDbStructure = {...} 
  const expectedDbStructure = {...} 

  const statements = pgDiffSync(
    currentDbStructure,
    expectedDbStructure
  )  
  // Returns an array of DDL statements to apply on the PostgreSQL database
```

## <a name="api"></a>API

### pgDiffSync(baseDbStructure, targetDbStructure)

### Arguments:
| Arg  | Type | Notes |
| ---  | ----- | ------ |
| `baseDbStructure`  | `object`  | An object representing the original starting position of a database - most likely the output conjured from the __[pg-info](https://github.com/wmfs/pg-info)__ package |
| `targetDbStructure`  | `object`  | And an object representing how the database needs to be - in the same form as `baseDbStructure` (again see the __[pg-info](https://github.com/wmfs/pg-info)__ package for more details) |

## <a name="output"></a>Output

The output from __pg-diff-sync__ is a simple array of strings.

* Each string is a separate DDL statement, that should be run on the PostgreSQL database that produced the `baseDbStructure` object. 
* With some caveats, running these statements on the _base_ database will turn it into the _target_ database

__Example output__

```json
[
  "CREATE SCHEMA pg_diff_sync_test;",
  "COMMENT ON SCHEMA pg_diff_sync_test IS 'Schema auto-generated by Relationize.js!';",
  "CREATE TABLE pg_diff_sync_test.people();",
  "COMMENT ON TABLE pg_diff_sync_test.people IS 'Just a simple list of people!';",
  "ALTER TABLE pg_diff_sync_test.people ADD COLUMN employee_no text NOT NULL;",
  "ALTER TABLE pg_diff_sync_test.people ADD COLUMN first_name text NOT NULL;",
  "ALTER TABLE pg_diff_sync_test.people ADD COLUMN last_name text NOT NULL;",
  "ALTER TABLE pg_diff_sync_test.people ADD COLUMN age integer;",
  "ALTER TABLE pg_diff_sync_test.people ADD COLUMN _created timestamp with time zone NOT NULL DEFAULT now();",
  "ALTER TABLE pg_diff_sync_test.people ADD COLUMN _created_by text;",
  "ALTER TABLE pg_diff_sync_test.people ADD COLUMN _modified timestamp with time zone NOT NULL DEFAULT now();",
  "ALTER TABLE pg_diff_sync_test.people ADD COLUMN _modified_by text;",
  "COMMENT ON COLUMN pg_diff_sync_test.people.first_name IS 'Person''s first name';",
  "COMMENT ON COLUMN pg_diff_sync_test.people.age IS 'Age in years';",
  "COMMENT ON COLUMN pg_diff_sync_test.people._created IS 'Timestamp for when this record was created';",
  "COMMENT ON COLUMN pg_diff_sync_test.people._created_by IS 'UserID that created this record (if known)';",
  "COMMENT ON COLUMN pg_diff_sync_test.people._modified IS 'Timestamp for when this record was last updated';",
  "COMMENT ON COLUMN pg_diff_sync_test.people._modified_by IS 'UserID that last modified this record (if known)';",
  "ALTER TABLE pg_diff_sync_test.people ADD PRIMARY KEY (employee_no);",
  "CREATE UNIQUE INDEX people_first_name_last_name_idx ON pg_diff_sync_test.people (first_name,last_name);"
]
```

## <a name="test"></a>Testing


```bash
$ npm test
```

## <a name="license"></a>License
[MIT](https://github.com/wmfs/pg-diff-sync/blob/master/LICENSE)
