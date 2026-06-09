
import { getComplaintPayload } from "./apiPayload";
import END_POINTS from "./endPoints";
import MakeRequest from "./makeRequest";

class ApiManager {
    static complaint = async (message: string, image: File | null, currentSessionId: string) => {
        const url = END_POINTS.COMPLAINT.GENERATE
        const payload = getComplaintPayload(message, image, currentSessionId)
        return MakeRequest.post(url, payload)
    }

    static platformAnalytics = async () => {
        const url = END_POINTS.ANALYTICS.PLATFROM
        return MakeRequest.get(url)
    }

    static dashboardAnalytics = async () => {
        const url = END_POINTS.ANALYTICS.DASHBOARD
        return MakeRequest.get(url)
    }

    static newSession = async () => {
        const url = END_POINTS.SESSION.CREATE
        return MakeRequest.post(url)
    }

    static getAllSessions = async () => {
        const url = END_POINTS.SESSION.GET_SESSIONS
        return MakeRequest.get(url)
    }

    static currentSessionChats = async (params: { sessionId: string }) => {
        const url = END_POINTS.CHAT.FETCH_CURRENT_CHAT
        return MakeRequest.get(url, params)
    }
}

export default ApiManager;