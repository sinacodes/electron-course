import path from 'path';
import { remote } from 'electron';
import knex from 'knex';
import 'sqlite3';

const { app } = remote;

const database = knex({
    client: 'sqlite3',
    connection: {
        filename: path.join(app.getPath('userData'), 'clipfile.sqlite')
    },
    useNullAsDefault: true
});

database.schema.hasTable('clippings')
    .then(exists => {
        if (!exists) {
            return database.schema.createTable('clippings', t => {
                t.increments('id').primary();
                t.text('content');
            })
        }
    })
    .catch(e => console.error(e))

export default database;
