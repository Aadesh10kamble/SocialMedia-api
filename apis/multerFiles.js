import multer from 'multer';

const fileFilter = (req, file, cb) => {
    cb(null, file.mimetype.startsWith('image'));
};

const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter });

export const collectPhotos = upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);
