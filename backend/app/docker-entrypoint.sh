#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Waiting for database to be ready..."
# Use a simple node script to wait for Postgres
node -e "
const { Client } = require('pg');
const client = new Client({
  host: process.env.FA_DB_HOST || 'postgres',
  port: process.env.FA_DB_PORT || 5432,
  user: process.env.FA_DB_USER,
  password: process.env.FA_DB_PASSWORD,
  database: process.env.FA_DB_NAME,
});

async function waitForDb() {
  let retries = 5;
  while (retries > 0) {
    try {
      await client.connect();
      console.log('Database is ready!');
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log('Waiting for database...', err.message);
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  process.exit(1);
}
waitForDb();
"

echo "Running database migrations..."
npm run migration:run:prod

echo "Starting application..."
exec "$@"
