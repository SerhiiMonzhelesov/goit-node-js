const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { nanoid } = require("nanoid");
const fs = require("fs/promises");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const tempDir = path.join(__dirname, "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

const contacts = [];

app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

const contactsDir = path.join(__dirname, "public", "contacts");

app.post("/api/contacts", upload.single("photo"), async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const resultUpload = path.join(contactsDir, originalname);
  await fs.rename(tempUpload, resultUpload);
  const cont = path.join("contacts", originalname);
  const newContact = {
    id: nanoid(),
    ...req.body,
    cont,
  };
  contacts.push(newContact);

  res.status(201).json(newContact);
});

// app.use("/api/contacts", contactsRouter);

// app.use(async (req, res, next) => {
//   const { method, url } = req;
//   const date = moment().format("DD-MM-YYYY_hh:mm:ss");
//   await fs.appendFile("./public/server.log", `\n${method} ${url} ${date}`);
//   next();
// });

// app.use((req, res) => {
//   res.status(404).json({ message: "Not found" });
// });

// app.use((err, req, res, next) => {
//   const { status = 500, message = "Server error" } = err;
//   res.status(status).json({ message });
// });

app.listen(3000, () => {
  console.log("Relax, everything is fine");
});
