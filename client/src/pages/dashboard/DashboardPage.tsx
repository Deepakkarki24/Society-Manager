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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";

const COLORS = [
  "#00c6ff",
  "#0072ff",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
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
  const [isChatFecthing, setIsChatFetching] = useState(true)
  const [userChats, setUserChats] = useState<ComplaintCardProps[]>([])
  // const [chatsRole, setChatRole] = useState<"user" | "ai" | null>(null)
  const [currentSessionId, setCurrentSessionId] =
    useState<string | null>(
      localStorage.getItem(currentSessionKey)
    );
  const [sessions, setSessions] = useState<SessionsInterface[]>([]);
  const sessionsContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

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

      setIsChatFetching(true)

      const response = await getCurrentSessionChats(params)

      if (!response.success) {
        setIsChatFetching(false)
        return
      }

      const data = response.data as any

      // console.log(data.data)
      setUserChats(data.data)

    } catch (err) {
      console.log(err)
    } finally {
      setIsChatFetching(false)
    }
  }

  const fecthSessions = async () => {

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

    if (sessions && userChats.length === 0) return

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

    fetchCurrentSessionChats({ sessionId: sessionId })

    setCurrentSessionId(sessionId);
  };

  useEffect(() => {
    getDashboardAnalyticsData();
    initializeChat()

    if (!currentSessionId) return

    fecthSessions();
    fetchCurrentSessionChats({ sessionId: currentSessionId })

  }, []);

  useEffect(() => {

    if (!currentSessionId) return

    fecthSessions()
    fetchCurrentSessionChats({ sessionId: currentSessionId })

    localStorage.setItem(currentSessionKey, currentSessionId)
  }, [currentSessionId]);

  useEffect(() => {
    if (!isChatFecthing) {
      scrollToBottom();
    }
  }, [userChats, isChatFecthing]);

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
      {(user?.role === "resident" || user?.role === "maintenance_staff") &&
        (
          <div className="relative flex flex-col w-full max-sm:h-dvh min-h-[80dvh] max-w-4xl mx-auto">

            {/* Session Header */}
            {(sessions.some((s) => s.userId === user?._id)) && sessions.length > 0 && (
              <div className="absolute top-0 w-full z-20 mb-6">
                <div className="flex items-center gap-2 p-2 glass-strong rounded-xl">

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={createNewChatSession}
                        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl ring-1 ring-primary-400/25 transition-colors cursor-pointer"
                      >
                        <PlusIcon size={22} className="text-white" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Create new chat
                    </TooltipContent>
                  </Tooltip>

                  <div
                    ref={sessionsContainerRef}
                    className={`flex-1 flex gap-2 ${sessions.length >= 3 ? "pb-2" : ""} overflow-x-auto`}
                  >
                    {isSessionFecthing ? (
                      Array.from({ length: 5 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="shrink-0 w-28 h-10 rounded-xl bg-surface-hover animate-pulse"
                        />
                      ))
                    ) : (
                      [...sessions].reverse().map((s) => (
                        <button
                          key={s._id}
                          onClick={() => handleSessionClick(s._id)}
                          className={`shrink-0 cursor-pointer px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200
                  ${currentSessionId === s._id
                              ? "bg-linear-to-br from-[#00c8ff75]  to-[#0073ff66] text-white shadow-md shadow-primary-600/25"
                              : "bg-white/5 backdrop-blur-sm text-text-secondary hover:bg-surface-card hover:text-text-primary"
                            }`}
                        >
                          {s.title}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 flex flex-col gap-4 pt-18 overflow-y-auto sm:pb-6 sm:pt-20 scroll-smooth">

              {/* Loading State */}
              {isChatFecthing && (
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-full h-32 rounded-xl bg-surface-hover animate-pulse"
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isChatFecthing && userChats.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <h1 className="text-4xl tracking-wide font-stretch-semi-condensed text-white">
                    Welcome, {user?.name?.split(" ")[0]}!
                  </h1>

                  <p className="mt-2 text-sm font-stretch-semi-condensed tracking-wider text-white">
                    What&apos;s happening in your society?
                  </p>
                </div>
              )}

              {/* Messages */}
              {!isChatFecthing &&
                userChats.length > 0 &&
                userChats.map((m: any) => (
                  <ComplaintCard
                    key={m._id || m.complaint?._id}
                    title={m.complaint.title}
                    description={m.complaint.description}
                    image={m.complaint.image}
                    category={m.complaint.category}
                    createdAt={m.complaint.createdAt}
                    status={m.complaint.status}
                    priority={m.complaint.priority}
                  />
                ))}
            </div>

            {/* Input */}
            <div className="sticky bottom-0 z-20 pt-4 bg-transparent">
              <ChatInput
                fecthSessions={fecthSessions}
                fetchCurrentSessionChats={fetchCurrentSessionChats}
                currentSessionId={currentSessionId} />
            </div>
          </div>
        )
      }

      {
        (user?.role === "super_admin" || user?.role === "society_admin") && (
          <div className="w-full">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-text-primary">
                Welcome, {user?.name}
              </h1>
              <p className="text-text-secondary">What&apos;s happening in your society</p>
            </div>

            <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-4 my-4">
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
                      fill="#0072ff"
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
                  <p className="py-12 text-center text-text-muted">No data yet</p>
                )}
              </Card>
            </div>
          </div>
        )
      }

    </>
  );
};
