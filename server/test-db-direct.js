const { Client } = require('pg');

async function testConn(url) {
  console.log("Testing connection to:", url);
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log("Success connecting to:", url);
    const res = await client.query('SELECT current_database(), current_user');
    console.log("Result:", res.rows);
  } catch (err) {
    console.error("Failed to connect:", err.message);
  } finally {
    await client.end().catch(() => {});
  }
}

async function run() {
  await testConn("postgres://postgres:postgres@127.0.0.1:51214/template1");
  await testConn("postgres://postgres:postgres@127.0.0.1:51214/postgres");
}

run();
