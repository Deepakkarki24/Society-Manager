import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  MessageSquareWarning,
  CheckCircle,
  Clock,
  Building2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useAppSelector } from "@/store/hooks";
import type { DashboardAnalytics } from "@/types";
import { MONTHS } from "@/constants";
import ChatInput from "@/components/chat/ChatInput";
import { createNewSession, getCurrentSessionChats, getDashboardAnalytics, getSessions } from "@/api-manager/requestHandler";
import { ComplaintCard, type ComplaintCardProps } from "@/components/chat/CompaintCard";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { currentSessionKey } from "@/utils/localStorageKeys";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

interface SessionsInterface {
  _id: string,
  title: string,
  userId: string,
  createdAt: string
}

export const DashboardPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionFecthing, setIsSessionFetching] = useState(false)
  const [userChats, setUserChats] = useState<ComplaintCardProps[]>([])
  const [chatsRole, setChatRole] = useState<"user" | "ai" | null>(null)
  const [currentSessionId, setCurrentSessionId] =
    useState<string | null>(
      localStorage.getItem(currentSessionKey)
    );
  const [sessions, setSessions] = useState<SessionsInterface[]>([]);
  const sessionsContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  const initializeChat = async () => {
    try {

      if (currentSessionId) return

      setIsSessionFetching(true)

      const response = await createNewSession()

      const { data } = response.data as ({ data: any })

      setCurrentSessionId(data._id);
    } catch (err) {

    } finally {
      setIsSessionFetching(false)
    }

  };


  const getDashboardAnalyticsData = async () => {
    try {
      const res = await getDashboardAnalytics()
      const { data } = res.data as any;
      setAnalytics(data)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }

  }

  useLayoutEffect(() => {
    if (sessionsContainerRef.current) {
      sessionsContainerRef.current.scrollLeft = scrollPositionRef.current;
    }
  }, [currentSessionId]);


  const fetchCurrentSessionChats = async (params: { sessionId: string }) => {
    try {
      const response = await getCurrentSessionChats(params)
      console.log(response.data)
      // setCurrentSessionId(params.sessionId)
    } catch (err) {
      console.log(err)
    }
  }

  const fecthSessions = async () => {

    setIsSessionFetching(true)

    try {
      const response = await getSessions()
      const { data } = response.data as ({ data: [any] })

      setSessions(data)

      const storedSessionId = localStorage.getItem(currentSessionKey);

      if (storedSessionId) {
        const sessionExists = data.some(
          session => session._id === storedSessionId
        );

        if (!sessionExists) {
          localStorage.removeItem(currentSessionKey);
          setCurrentSessionId(null);
        }
      }

    } catch (err) {
      console.log(err)
    } finally {
      setIsSessionFetching(false)
    }
  }

  const createNewChatSession = async () => {
    try {
      const response = await createNewSession()
      const { data } = response.data as ({ data: any })

      let sessionId = data._id;
      setCurrentSessionId(sessionId)

    } catch (err) {
      console.log(err)
    }
  }

  const handleSessionClick = (sessionId: string) => {
    if (sessionsContainerRef.current) {
      scrollPositionRef.current = sessionsContainerRef.current.scrollLeft;
    }

    // fetchCurrentSessionChats({ sessionId: sessionId || "" })

    setCurrentSessionId(sessionId);
  };

  useEffect(() => {
    getDashboardAnalyticsData();
    fecthSessions();
    initializeChat()
  }, []);

  useEffect(() => {
    fecthSessions()

    localStorage.setItem(currentSessionKey, currentSessionId || "")
  }, [currentSessionId]);

  if (
    loading &&
    (user?.role === "society_admin" || user?.role === "super_admin")
  ) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const chartData =
    analytics?.monthlyTrends?.map((t) => ({
      name: `${MONTHS[t._id.month - 1]} ${t._id.year}`,
      complaints: t.count,
      resolved: t.resolved,
    })) || [];

  const categoryData =
    analytics?.categoryStats?.map((c) => ({
      name: c._id,
      value: c.count,
    })) || [];

  return (
    <>
      {user?.role === "society_admin" || user?.role === "super_admin" ? (
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-500">What&apos;s happening in your society</p>
        </div>
      ) : (
        <div className="relative w-full h-auto">
          {userChats.length !== 0 ?
            <div className={`flex flex-col items-center justify-center gap-18 w-full min-h-[80dvh] h-full`}>
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl tracking-wide font-semibold text-gray-900 dark:text-white">
                  Welcome, {user?.name.split(" ")[0]}!
                </h1>
                <p className="dark:text-white/50 text-lg">
                  What&apos;s happening in your society?
                </p>
              </div>
              <ChatInput currentSessionId={currentSessionId} />
            </div>
            :
            <div className={`relative flex flex-col items-end justify-end gap-10 w-full max-w-4xl mx-auto min-h-[80dvh] h-full`}>
              {sessions.length > 0 && (
                <div className="absolute top-0 left-0 w-full">
                  <div className="flex items-center gap-2 p-2 bg-white/5 backdrop-blur-sm rounded-lg">
                    <button
                      onClick={() => createNewChatSession()}
                      className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <PlusIcon size={22} className="text-white" />
                    </button>

                    <div ref={sessionsContainerRef} className="flex-1 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      {!isSessionFecthing ? (
                        [...sessions].reverse().map((s) => (
                          <button
                            key={s._id}
                            onClick={() => handleSessionClick(s._id)}
                            className={`shrink-0 cursor-pointer px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                          ${currentSessionId === s._id
                                ? "bg-red-400 text-white"
                                : "bg-white/10 text-white hover:bg-white/20"
                              }`}
                          >
                            {s.title}
                          </button>
                        ))
                      ) : (
                        sessions.map((_, idx) => (
                          <div
                            key={idx}
                            className="shrink-0 w-28 h-10 rounded-lg bg-white/20 animate-pulse"
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {
                userChats && userChats.map((m) => (
                  <ComplaintCard title={m.title} description={m.description} image={m.image} category={m.category} createdAt={m.createdAt} status={m.status} priority={m.priority} />
                ))
              }
              <ChatInput currentSessionId={currentSessionId} />
            </div>
          }
        </ div >
      )}


      {
        (user?.role === "super_admin" || user?.role === "society_admin") && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 my-4">
            <StatCard
              title="Total Complaints"
              value={analytics?.complaints.total ?? 0}
              icon={MessageSquareWarning}
              color="blue"
            />
            <StatCard
              title="Resolved"
              value={analytics?.complaints.resolved ?? 0}
              icon={CheckCircle}
              color="green"
              trend={`${analytics?.complaints.resolutionRate ?? 0}% resolution rate`}
            />
            <StatCard
              title="Pending"
              value={analytics?.complaints.pending ?? 0}
              icon={Clock}
              color="yellow"
            />
            <StatCard
              title="Societies"
              value={analytics?.societies.total ?? 0}
              icon={Building2}
              color="purple"
            />
          </div>
        )
      }

      {
        (user?.role === "super_admin" || user?.role === "society_admin") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Monthly Complaint Trends">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="complaints"
                    fill="#3b82f6"
                    name="Total"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="resolved"
                    fill="#10b981"
                    name="Resolved"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Complaints by Category">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-12 text-center text-gray-500">No data yet</p>
              )}
            </Card>
          </div>
        )
      }
    </>
  );
};
