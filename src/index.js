// dependencies
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const extractImage = require('./utils/extractImage');
const extractPdf = require('./utils/extractPdf');
const pool = require('./config/database');
const upload = require('./utils/multer');
const runMigration = require('./utils/runMigration');
const multer = require('multer');

// initialize the app
const app = express();

// Endpoint to extract data from image or pdf
app.post('/metadata', upload.single('file'), async (req, res, next) => {
  const { path: filePath, mimetype } = req.file;

  let db = await pool.getConnection();

  try {
    let fileType, dimension, extractedData;

    // check if the file is an image or a PDF
    if (mimetype.startsWith('image/') || mimetype === 'application/pdf') {
      // process image
      if (mimetype.startsWith('image/')) {
        const imageData = await extractImage(filePath);
        fileType = mimetype;
        dimension = imageData.dimension;
        extractedData = imageData.metadata;
      }
      // process PDF
      else if (mimetype === 'application/pdf') {
        const pdfData = await extractPdf(filePath);
        fileType = mimetype;
        dimension = null;
        extractedData = pdfData;
      }

      // store file information to database
      const result = await db.query(
        `INSERT INTO files (fileType, dimension, extractedData, createdAt) VALUES (?, ?, ?, ?)`,
        [fileType, dimension, extractedData, new Date()]
      );

      // check if the insertion was successful
      if (result[0].affectedRows) {
        //send response
        return res.status(201).json({
          status: 'success',
          fileType,
          dimension,
          metadata: extractedData,
        });
      }
    }
  } catch (error) {
    console.error(error);
    next(new Error(error.message));
  } finally {
    //delete the file
    fs.unlink(filePath, err => console.error(err));
    db.release();
  }
});

// global error middleware
app.use((error, req, res, next) => {
  return res.status(500).json({
    status: 'error',
    message: error.message,
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Server is alive on PORT:${PORT}`);
  console.log('Database connected successfully');
  await runMigration();
});
