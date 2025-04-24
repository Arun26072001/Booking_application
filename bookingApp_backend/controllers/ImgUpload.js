const express = require("express");
const multer = require("multer");
const path = require("path");

const imgUpload = express.Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './tripDocs');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = allowedTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
      cb(null, true);
    } else {
      cb(new Error("Error: File type not supported!"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// POST route for uploading and converting files
imgUpload.post("/", upload.array("photo", 10), async (req, res) => {

  try {

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "No files uploaded." });
    }

    // Respond with the conversion results
    res.status(200).send({
      message: "Files uploaded and converted successfully!",
      files: req.files.map((file) => ({
        filename: process.env.BACKEND_BASEURL + "/" + "tripDocs" + "/" + file.filename
      })),
    });
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = { imgUpload, upload };
