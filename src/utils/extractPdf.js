const pdf = require('pdf-parse');

const extractPdf = async filePath => {
  try {
    const pdfData = await pdf(filePath);
    return pdfData.text;
  } catch (error) {
    return error;
  }
};

module.exports = extractPdf;
