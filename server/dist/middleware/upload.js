"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleImages = exports.uploadToCloudinary = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../config/cloudinary");
const ApiError_1 = require("../utils/ApiError");
const stream_1 = require("stream");
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new ApiError_1.ApiError(400, 'Only image files are allowed'), false);
        }
    },
});
const uploadToCloudinary = async (buffer, folder) => {
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET;
    if (!hasCloudinary) {
        return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({ folder: `simp/${folder}` }, (error, result) => {
            if (error || !result)
                reject(error || new Error('Upload failed'));
            else
                resolve(result.secure_url);
        });
        stream_1.Readable.from(buffer).pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const uploadMultipleImages = async (files, folder) => {
    if (!files?.length)
        return [];
    return Promise.all(files.map((f) => (0, exports.uploadToCloudinary)(f.buffer, folder)));
};
exports.uploadMultipleImages = uploadMultipleImages;
//# sourceMappingURL=upload.js.map