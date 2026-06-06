import ApiManager from "./apiManager"

export const getPlatformAnalytics = async () => {
    const response = await ApiManager.platformAnalytics()
    return response;
}

export const getDashboardAnalytics = async () => {
    const response = await ApiManager.dashboardAnalytics()
    return response;
}

export const generateComplaint = async (message: string, image: File | null) => {
    const response = await ApiManager.complaint(message, image)
    return response
}