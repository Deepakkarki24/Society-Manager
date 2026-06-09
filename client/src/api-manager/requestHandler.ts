import ApiManager from "./apiManager"

export const getPlatformAnalytics = async () => {
    const response = await ApiManager.platformAnalytics()
    return response;
}

export const getDashboardAnalytics = async () => {
    const response = await ApiManager.dashboardAnalytics()
    return response;
}

export const generateComplaint = async (message: string, image: File | null, currentSessionId: string) => {
    const response = await ApiManager.complaint(message, image, currentSessionId)
    return response
}

export const createNewSession = async () => {
    const response = await ApiManager.newSession()
    return response
}

export const getSessions = async () => {
    const response = await ApiManager.getAllSessions()
    return response
}

export const getCurrentSessionChats = async (params: { sessionId: string }) => {
    const response = await ApiManager.currentSessionChats(params)
    return response
}