# Database
Database migrations are managed by [sequelize](https://sequelize.org/) and applied on startup by [umzug](https://github.com/sequelize/umzug)

`yarn add sequelize-cli`

## Warning
*Sequelize* reads database connection form config file, which is included as *example* only

**please don't commit real connection details!**

## Examples
### Generate new model
`yarn sequelize-cli model:generate --name User --attributes name:string,email:string,password:string`

This will generate a new model and migration

[Docs](https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-model-and-migration)

### Migrations
[Docs](https://sequelize.org/docs/v6/other-topics/migrations/#running-migrations)

- `yarn sequelize-cli db:migrate` - apply migrations
- `yarn sequelize-cli db:migrate:undo` - revert last migration
- `yarn sequelize-cli db:migrate:undo:all` - revert all migrations
- `yarn sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js` - revert to specific migration

### Generate seed
`yarn sequelize-cli seed:generate --name example` 

This will create a template for migration that seeds database

[Docs](https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-seed)

### Running and undoing seeds
- `npx sequelize-cli db:seed:all`
- `npx sequelize-cli db:seed:undo`
- `npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data`
- `npx sequelize-cli db:seed:undo:all`

[Docs](https://sequelize.org/docs/v6/other-topics/migrations/#undoing-seeds)