const express = require("express");
const multer = require("multer");
const { convertFile } = require("../controllers/convertController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/convert", upload.single("file"), convertFile);

module.exports = router;
