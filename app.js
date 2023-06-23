const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
// const path = require("path");
// const fs = require("fs").promises;
// const multer = require("multer");
// const Jimp = require("jimp");

require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");
const verifyFolders = require("./utils/locations");
const { authMiddleware } = require("./middleware");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// const uploadDir = path.join(process.cwd(), "tmp");
// const storeImage = path.join(process.cwd(), "public", "avatars");

// console.log(uploadDir + `\n` + storeImage);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 100);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
//   limits: {
//     fileSize: 1048576,
//   },
// });

// const upload = multer({ storage: storage });

// app.patch(
//   "/users/avatars",
//   upload.single("picture"),
//   async (req, res, next) => {
//     const { path: temporaryPath, originalname } = req.file;
//     const fileName = path.join(storeImage, originalname);

//     console.log(temporaryPath);
//     console.log(req.file);
//     console.log(fileName);

//     try {
//       const avatar = await Jimp.read(temporaryPath);
//       await avatar.resize(250, 250);
//       console.log(avatar);

//       // await fs.rename(temporaryPath, fileName);
//     } catch (err) {
//       await fs.unlink(temporaryPath);
//       return next(err);
//     }
//     res.json({ message: "File uploaded successfully", status: 200 });
//   }
// );

app.use(express.static("public"));

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/config-passport");

app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/api/users", usersRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// const isAccessible = (path) => {
//   return fs
//     .access(path)
//     .then(() => true)
//     .catch(() => false);
// };

// const createFolderIsNotExist = async (folder) => {
//   if (!(await isAccessible(folder))) {
//     await fs.mkdir(folder);
//   }
// };

const URI = process.env.URI;
const PORT = process.env.PORT || 3000;

const connection = mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, function () {
      // createFolderIsNotExist(uploadDir);
      // createFolderIsNotExist(storeImage);
      verifyFolders();
      console.log("Database connection successful");
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });

module.exports = app;
