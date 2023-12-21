const sharp = require('sharp');
const Tesseract = require('tesseract.js');

/**
 * This function extract text/data from the image
 * @param {string} filePath
 * @returns {string}
 */
const extractImage = async filePath => {
  try {
    const result = {};

    //get the image dimension
    const image = await sharp(filePath);
    const imageInfo = await image.metadata();

    //run OCR operation with tesseract to extract text
    const tesseract = await Tesseract.recognize(filePath, 'eng');

    result.dimension = `${imageInfo.width}x${imageInfo.height}`;
    result.metadata = tesseract.data.text.replace(/\n/g, ' ');
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = extractImage;
