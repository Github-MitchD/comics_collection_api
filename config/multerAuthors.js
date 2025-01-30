const multer = require('multer');
const path = require('path');
// Défini où et comment seront stockés les fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Dossier de destination
        cb(null, 'public/uploads/authors/');
    },
    filename: (req, file, cb) => {
        // Génère un nom unique pour éviter les conflits
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Récupère l'extension du fichier original
        const ext = path.extname(file.originalname);
        // Construit le nom final du fichier
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

module.exports = upload;