import multer from 'multer';
import { cloudinary } from '../config/cloudinary';
import { ApiError } from '../utils/ApiError';
import { Readable } from 'stream';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only image files are allowed') as unknown as null, false);
    }
  },
});

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string
): Promise<string> => {
  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinary) {
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `simp/${folder}` },
      (error, result) => {
        if (error || !result) reject(error || new Error('Upload failed'));
        else resolve(result!.secure_url);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

export const uploadMultipleImages = async (
  files: Express.Multer.File[] | undefined,
  folder: string
): Promise<string[]> => {
  if (!files?.length) return [];
  return Promise.all(files.map((f) => uploadToCloudinary(f.buffer, folder)));
};
