import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const preApproveVisitor: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getVisitors: (req: AuthRequest, res: Response) => Promise<void>;
export declare const checkInVisitor: (req: AuthRequest, res: Response) => Promise<void>;
export declare const checkOutVisitor: (req: AuthRequest, res: Response) => Promise<void>;
export declare const rejectVisitor: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=visitor.controller.d.ts.map