const app = require('./src/app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 5000;

pool.query('SELECT NOW()')
  .then(() => {
    console.log('PostgreSQL connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  });