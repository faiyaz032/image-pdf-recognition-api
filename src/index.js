//dependencies
require('dotenv').config();
const express = require('express');
const extractImage = require('./utils/extractImage');
const extractPdf = require('./utils/extractPdf');
const pool = require('./config/database');
const upload = require('./utils/multer');
const fs = require('fs');
const runMigration = require('./utils/runMigration');

const app = express();

const PORT = process.env.PORT || 8080;

app.post('/metadata', upload.single('file'), async (req, res, next) => {
  const { path: filePath, mimetype } = req.file;

  let db = await pool.getConnection();

  try {
    if (mimetype === 'image/jpeg' || mimetype === 'image/jpg' || mimetype === 'image/png') {
      const imageData = await extractImage(filePath);

      const result = await db.query(
        `INSERT INTO files (fileType, dimension, extractedData, createdAt) VALUES (?, ?, ?, ?)`,
        [mimetype, imageData.dimension, imageData.metadata, new Date()]
      );

      if (result[0].affectedRows) {
        return res.status(201).json({
          status: 'success',
          fileType: mimetype,
          dimension: imageData.dimension,
          metadata: imageData.metadata,
        });
      }
    }

    if (mimetype === 'application/pdf') {
      const pdfData = await extractPdf(filePath);

      const result = await db.query(
        `INSERT INTO files (fileType, dimension, extractedData, createdAt) VALUES (?, ?, ?, ?)`,
        [mimetype, null, pdfData, new Date()]
      );

      if (result[0].affectedRows) {
        return res.status(201).json({
          status: 'success',
          fileType: mimetype,
          dimension: null,
          metadata: pdfData,
        });
      }

      return res.status(201).json({
        status: 'success',
        fileType: mimetype,
        dimension: null,
        metadata: pdfData,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    fs.unlink(filePath, err => console.log(err));
  }
});

app.listen(PORT, async () => {
  console.log(`Server is alive on PORT:${PORT}`);
  console.log('Database connected successfully');
  await runMigration();
});
