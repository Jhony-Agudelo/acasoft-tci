const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:24790141@localhost:5432/acasoft-tci'
});

async function check() {
  try {
    await client.connect();
    console.log("Connected successfully!");
    
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log("Tables:", res.rows);
  } catch(e) {
    console.error("Connection Error:", e.message);
  } finally {
    await client.end();
  }
}

check();
