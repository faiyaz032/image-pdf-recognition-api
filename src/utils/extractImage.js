const sharp = require('sharp');
const Tesseract = require('tesseract.js');

const extractImage = async filePath => {
  try {
    const result = {};
    const image = await sharp(filePath);
    const imageInfo = await image.metadata();

    const tesseract = await Tesseract.recognize(filePath, 'eng');

    result.dimension = `${imageInfo.width}x${imageInfo.height}`;
    result.metadata = tesseract.data.text.replace(/\n/g, ' ').split(' ');
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = extractImage;
