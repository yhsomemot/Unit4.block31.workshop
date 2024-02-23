// imports here for express and pg
const express = require('express');
const app = express();
const pg = require('pg');
const path = require('path');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_db')

// static routes here (you only need these for deployment)

// app routes here
 app.get('/api/employees', async(req, res, next) => {
    try {
        const SQL= `SELECT * FROM employees;`
        const response = await client.query(SQL);
        res.send(response.rows);

    } catch (err) {
        next(err)
    }
 })
// create your init function
const init = async () => {
    await client.connect();

    const SQL = `
        DROP TABLE IF EXISTS employees;

        CREATE TABLE employees(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            is_admin BOOLEAN DEFAULT FALSE
        );

        INSERT INTO employees(name, is_admin) VALUES('TOM', false);
        INSERT INTO employees(name, is_admin) VALUES('MARY', true);
        INSERT INTO employees(name) VALUES('BOB');


    `;

    await client.query(SQL);
    console.log(`data seeded`)

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    })
}
// init function invocation
init();