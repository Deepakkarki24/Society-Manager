
import { getComplaintPayload } from "./apiPayload";
import END_POINTS from "./endPoints";
import MakeRequest from "./makeRequest";

class ApiManager {
    static complaint = async (message: string, image: File | null) => {
        const url = END_POINTS.COMPLAINT.GENERATE
        const payload = getComplaintPayload(message, image)
        return MakeRequest.post(url, payload)
    }

    static platformAnalytics = async () => {
        const url = END_POINTS.ANALYTICS.PLATFROM
        return MakeRequest.get(url)
    }

    static dashboardAnalytics = async () =>{
        const url = END_POINTS.ANALYTICS.DASHBOARD
        return MakeRequest.get(url)
    }
}

export default ApiManager;