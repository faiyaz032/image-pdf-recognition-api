//dependencies
const pool = require('../config/database');

/**
 * This function runs the queries to create the necessary table
 */
async function runMigration() {
  try {
    const db = await pool.getConnection();

    // query to create 'users' table
    const createFilesTable = `
      CREATE TABLE IF NOT EXISTS files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fileType VARCHAR(255) NOT NULL,
        dimension VARCHAR(255) ,
        extractedData TEXT NOT NULL,
        createdAt TIMESTAMP 
      );
    `;

    await db.query(createFilesTable);

    console.log(`Initial table created successfully`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = runMigration;
