import { Response } from "express"
import { errorResponse, successResponse } from "../../utils/ApiResponse"
import { AuthRequest } from "../../middleware/auth"
import { Chat } from "../../models/chat/Chat"

export const getCurrentSessionChat = async (req: AuthRequest, res: Response) => {
    try {
        const { sessionId } = req.query

        console.log(sessionId)

        if (!sessionId) return errorResponse(res, 401, "Session id not found!")

        const foundChat = await Chat.find({ sessionId }).populate("complaint")
        
        if (!foundChat) return errorResponse(res, 401, "Chat not found!")

        return successResponse(res, 200, "Chats fetched!", foundChat)

    } catch (err) {
        return errorResponse(res, 500, (err as any).message)
    }
}