import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const createAnnouncement: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAnnouncements: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAnnouncement: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAnnouncement: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAnnouncement: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=announcement.controller.d.ts.map