const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");

app.use(express.static("public"));

const port = 3001;

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD, OPTIONS, POST, PUT, DELETE"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "Origin, X-Requested-With, Content-Type,Accept,Authorization"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//////////////// Multer configuration for file uploads/////////////
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

app.get("/getAllImages", (req, res) => {
  const accepted = ["jpg", "png", "jpeg"];
  fs.readdir(path.join(__dirname, "uploads"), (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).send("Error reading directory.");
      return;
    }

    const imageUrls = files.reduce((acc, file) => {
      const extend = file.split(".").pop();
      if (accepted.includes(extend)) {
        acc.push(`https://imagegallery-6.onrender.com/images/${file}`);
      }
      return acc;
    }, []);

    res.status(200).json(imageUrls);
  });
});

app.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "uploads", filename);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Error accessing file:", err);
      res.status(404).send("File not found.");
      return;
    }

    // Send the file
    res.sendFile(imagePath);
  });
});

app.delete("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "uploads", filename);

  // Check if the file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Error accessing file:", err);
      res.status(404).send("File not found.");
      return;
    }

    // Delete the file
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        res.status(500).send("Error deleting file.");
        return;
      }

      res.status(200).send("File deleted.");
    });
  });
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.body);
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  // You can perform additional operations with the uploaded image here.
  res.status(200).send("Image uploaded and saved successfully.");
});

app.listen(port, () => {
  console.log("Example app listening on port ${port}");
});
