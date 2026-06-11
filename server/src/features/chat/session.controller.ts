import { ChatSession } from "../../models/chat/ChatSession"
import { Response } from "express"
import { errorResponse, successResponse } from "../../utils/ApiResponse"
import { AuthRequest } from "../../middleware/auth"

export const createNewSession = async (req: AuthRequest, res: Response) => {
    try {
        const existingSession = await ChatSession.findOne({
            userId: req.user?._id,
            title: "New Chat",
        }).sort({ createdAt: -1 });

        if (existingSession) {
            return successResponse(
                res,
                200,
                "Existing session found",
                existingSession
            );
        }

        const newSession = await ChatSession.create({
            userId: req.user?._id,
            title: "New Chat",
        });

        return successResponse(res, 200, "Session created", newSession);
    } catch (err) {
        return errorResponse(res, 500, (err as any).message);
    }
};

// export const getCurrentSession = async (req: AuthRequest, res: Response) => {
//     try {
//         const { sessionId } = req.query

//         if (!sessionId) return errorResponse(res, 401, "Session id not found!")

//         const foundSession = await ChatSession.findOne({ _id: sessionId })

//         if (!foundSession) return errorResponse(res, 401, "Session not found!")

//         return successResponse(res, 200, "Active session id fetched!", foundSession)

//     } catch (err) {
//         return errorResponse(res, 500, (err as any).message)
//     }
// }

export const getAllSessions = async (req: AuthRequest, res: Response) => {
    try {

        const foundSessions = await ChatSession.find({ userId: req.user?._id })

        if (!foundSessions) return errorResponse(res, 401, "Sessions not found!")

        return successResponse(res, 200, "Active session id fetched!", foundSessions)

    } catch (err) {
        return errorResponse(res, 500, (err as any).message)
    }
}