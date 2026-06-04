
import END_POINTS from "./endPoints";
import MakeRequest from "./makeRequest";

class ApiManager {
    static platformAnalytics = async () =>{
        const url = END_POINTS.ANALYTICS.PLATFROM
        return MakeRequest.get(url)
    }

    static dashboardAnalytics = async () =>{
        const url = END_POINTS.ANALYTICS.DASHBOARD
        return MakeRequest.get(url)
    }
}

export default ApiManager;