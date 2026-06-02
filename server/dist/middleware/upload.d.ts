import multer from 'multer';
export declare const upload: multer.Multer;
export declare const uploadToCloudinary: (buffer: Buffer, folder: string) => Promise<string>;
export declare const uploadMultipleImages: (files: Express.Multer.File[] | undefined, folder: string) => Promise<string[]>;
//# sourceMappingURL=upload.d.ts.map