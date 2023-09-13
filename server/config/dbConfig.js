var mysql = require("mysql");
const bluebird = require("bluebird");
const pool = mysql.createConnection({
  connectionLimit: 10, 
  host: "165.232.178.58",
  user: "dev",
  password: "Anshu.@1237Ss",
  database: "richPanel",
});
pool.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected to MySQL Server!");
});

pool.query = bluebird.promisify(pool.query);
module.exports = pool;
