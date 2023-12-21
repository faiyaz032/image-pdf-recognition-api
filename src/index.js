//dependencies
const express = require('express');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const upload = require('./utils/multer');
const extractImage = require('./utils/extractImage');

const app = express();

const PORT = process.env.PORT || 8080;

app.post('/metadata', upload.single('file'), async (req, res, next) => {
  const { path: filePath, mimetype } = req.file;
  try {
    if (mimetype === 'image/jpeg' || mimetype === 'image/jpg' || mimetype === 'image/png') {
      const imageMetaData = await extractImage(filePath);

      return res.status(201).json({
        status: 'success',
        fileType: mimetype,
        ...imageMetaData,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    fs.unlink(filePath, err => console.log(err));
  }
});

app.listen(PORT, () => {
  console.log(`Server is alive on PORT:${PORT}`);
});
