const pdf = require('pdf-parse');

/**
 * This function extract text from the pdf
 * @param {string} filePath
 * @returns {string}
 */
const extractPdf = async filePath => {
  try {
    const pdfData = await pdf(filePath);
    return pdfData.text.replace(/\n/g, ' ');
  } catch (error) {
    return error;
  }
};

module.exports = extractPdf;
