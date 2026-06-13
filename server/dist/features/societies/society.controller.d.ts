import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const createSociety: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSocieties: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSociety: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateSociety: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteSociety: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const assignSocietyAdmin: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSocietyStats: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=society.controller.d.ts.map