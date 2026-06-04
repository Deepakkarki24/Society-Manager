import ApiManager from "./apiManager"

export const getPlatformAnalytics = async () => {
    const response = await ApiManager.platformAnalytics()
    return response;
}

export const getDashboardAnalytics = async () => {
    const response = await ApiManager.dashboardAnalytics()
    return response;
}