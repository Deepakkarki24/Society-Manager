import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage: multer.memoryStorage(), limits: {
    fileSize: 20 * 1024 * 1024 //max size 20 mb
  }
});

export const uploadMultipleImages = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'image_two', maxCount: 1 },
]);

export const uploadSingleImage = upload.single('image');

export const uploadWithoutImage = upload.none();