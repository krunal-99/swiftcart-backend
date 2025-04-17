import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.split(".").pop()!);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpg, png) are allowed"));
  },
});

export default upload;
