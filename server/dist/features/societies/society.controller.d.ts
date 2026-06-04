import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const createSociety: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSocieties: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSociety: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateSociety: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteSociety: (req: AuthRequest, res: Response) => Promise<void>;
export declare const assignSocietyAdmin: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSocietyStats: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=society.controller.d.ts.map