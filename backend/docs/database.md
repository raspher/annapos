# Database
Database migrations are managed by **TypeORM** 

`yarn add typeorm`

## Examples
[More docs](https://typeorm.io/docs/getting-started)

### Migrations
Complicated queries at the moment, but they work. 

#### apply migrations
`node --loader ts-node/esm --env-file=../.env.dev ./node_modules/typeorm/cli.js migration:run -d dist/src/db/dataSource.js`

#### generate migration
`node --loader ts-node/esm --env-file=../.env.dev ./node_modules/typeorm/cli.js migration:generate --esm -d src/db/dataSource.ts migrations/${migration_name}`

#### create empty migration
`node --loader ts-node/esm --env-file=../.env.dev ./node_modules/typeorm/cli.js migration:create --esm migrations/${migration_name}`

