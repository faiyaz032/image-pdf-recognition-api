// dependencies
require('dotenv').config();
const express = require('express');
const responseTime = require('response-time');
const fs = require('fs');
const client = require('prom-client');
const extractImage = require('./utils/extractImage');
const extractPdf = require('./utils/extractPdf');
const pool = require('./config/database');
const upload = require('./utils/multer');
const runMigration = require('./utils/runMigration');
const multer = require('multer');
const logger = require('./utils/logger');

// initialize the app
const app = express();

//prometheus
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({
  register: client.register,
});

const requestResponseTime = new client.Histogram({
  name: 'request_time',
  help: 'this tells how much time is taken by request and response',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000, 10000, 20000],
});

const totalRequestCounter = new client.Counter({
  name: 'total_request',
  help: 'Tells total request',
});
app.use(
  responseTime((req, res, time) => {
    totalRequestCounter.inc();
    requestResponseTime
      .labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode,
      })
      .observe(time);
  })
);

app.get('/', (req, res) => {
  logger.info(`Request on ${req.url}`);
  res.json({
    status: 'success',
    message: 'Hello from the server',
  });
});

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

// Endpoint to extract data from image or pdf
app.post('/metadata', upload.single('file'), async (req, res, next) => {
  logger.info(`Request on ${req.url}`);
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
    console.log(error.message);
    logger.error(error.message);
    next(new Error(error.message));
  } finally {
    //delete the file
    fs.unlink(filePath, err => console.error(err));
    db.release();
  }
});

// global error middleware
app.use((error, req, res, next) => {
  logger.error(error.message);
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
