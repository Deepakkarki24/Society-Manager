import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const submitFeedback: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFeedback: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=feedback.controller.d.ts.map