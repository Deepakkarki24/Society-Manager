const END_POINTS = {
    COMPLAINT: {
        GENERATE: "/api/complaints/create"
    },
    ANALYTICS: {
        PLATFROM: "/api/analytics/platform",
        DASHBOARD: "/api/analytics/dashboard"
    },
    SESSION: {
        CREATE: "/api/sessions/create",
        // GET_SESSION: "/api/sessions/get-current-session",
        GET_SESSIONS: "/api/sessions/get-sessions"
    },
    CHAT: {
        FETCH_CURRENT_CHAT: "/api/chats/get-session-chats"
    }
}

export default END_POINTS;