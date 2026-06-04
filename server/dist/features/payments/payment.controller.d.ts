import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const generateInvoices: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPayments: (req: AuthRequest, res: Response) => Promise<void>;
export declare const recordPayment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPaymentSummary: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=payment.controller.d.ts.map