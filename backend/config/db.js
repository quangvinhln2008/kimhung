const sql = require('mssql')
const port = process.env.PORT === 'production' ? (dotenv.PORT || 80) : 3001;

const dotenv = require('dotenv');
dotenv.config();

// config for your database
const config = {
    user: 'sa',
    password: 'P@ssWord',
    server:'192.168.123.17', 
    database: 'kimhung',
    port: 1433,
    options: {
      trustedConnection: true,
      trustServerCertificate: true,
    }
};
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to database');
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql,poolPromise
}