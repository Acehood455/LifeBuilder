const { Client } = require('pg');
const client = new Client({
  connectionString: "postgres://LifeBuilder_owner:npg_c7XPRxjVr2Ci@ep-wispy-wind-ab7bksnq-pooler.eu-west-2.aws.neon.tech/LifeBuilder?sslmode=require"
});

client.connect()
  .then(() => console.log("Connected successfully!"))
  .catch(e => console.error("Connection failed:", e))
  .finally(() => client.end());