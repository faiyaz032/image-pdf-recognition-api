//dependencies
const express = require('express');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const Tesseract = require('tesseract.js');

const app = express();

const PORT = process.env.PORT || 8080;

app.post('/metadata', async (req, res, next) => {
  const FILE_PATH = path.join(__dirname, './uploads/id.jpg');

  const response = {};
  const image = await sharp(FILE_PATH).toBuffer();

  const tesseract = await Tesseract.recognize(image, 'eng');
  console.log(tesseract.data.text.replace(/\n/g, ' ').split(' '));
});

app.listen(PORT, () => {
  console.log(`Server is alive on PORT:${PORT}`);
});
