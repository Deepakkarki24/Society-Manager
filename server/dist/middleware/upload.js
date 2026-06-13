"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadWithoutImage = exports.uploadSingleImage = exports.uploadMultipleImages = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), limits: {
        fileSize: 20 * 1024 * 1024 //max size 20 mb
    }
});
exports.uploadMultipleImages = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'image_two', maxCount: 1 },
]);
exports.uploadSingleImage = upload.single('image');
exports.uploadWithoutImage = upload.none();
//# sourceMappingURL=upload.js.map