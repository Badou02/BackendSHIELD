const multer = require('multer');

// On stocke les fichiers dans la mémoire, pas dans le disque
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite : 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées !'), false);
    }
  }
});

module.exports = { upload };
