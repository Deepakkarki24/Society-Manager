import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const createAnnouncement: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAnnouncements: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAnnouncement: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateAnnouncement: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteAnnouncement: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=announcement.controller.d.ts.map