import { useState, useEffect } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./components/AdminPanel";
import { LogOut, Home, Trophy, Settings } from "lucide-react";
import web3Service from "./utils/web3";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userRole, setUserRole] = useState("student");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    totalTokens: 0,
    credentials: 0,
    credentialsList: [],
    eventHistory: [],
    totalEvents: 0,
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (isConnected) {
      loadDashboardData();
      loadLeaderboard();
      loadEvents();
    }
  }, [isConnected, walletAddress]);
  // Add this useEffect below your existing useEffect that loads data
  useEffect(() => {
    if (!isConnected) return;

    // Polling interval, e.g., every 10 seconds
    const interval = setInterval(() => {
      loadDashboardData(); // refresh student dashboard
      loadLeaderboard(); // refresh leaderboard
      loadEvents(); // refresh available events
    }, 1000); // 10000 ms = 10 seconds

    // Cleanup interval when component unmounts or user disconnects
    return () => clearInterval(interval);
  }, [isConnected, walletAddress]);

  const handleConnect = async (address, role) => {
    web3Service.setCurrentAccount(address);
    web3Service.setUserRole(role);
    setWalletAddress(address);
    setUserRole(role);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    setUserRole("student");
    setActiveTab("dashboard");
  };

  // const loadDashboardData = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await web3Service.getDashboard();
  //     setDashboardData(result.data);
  //   } catch (error) {
  //     console.error("Failed to load dashboard:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const loadDashboardData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const result = await web3Service.getDashboard();
      setDashboardData(result.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };
  const loadLeaderboard = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const result = await web3Service.getLeaderboard(10);
      setLeaderboard(result.leaderboard);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const loadEvents = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const result = await web3Service.getEvents();
      setEvents(result.events);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  // const loadLeaderboard = async () => {
  //   try {
  //     const result = await web3Service.getLeaderboard(10);
  //     setLeaderboard(result.leaderboard);
  //   } catch (error) {
  //     console.error("Failed to load leaderboard:", error);
  //   }
  // };

  // const loadEvents = async () => {
  //   try {
  //     const result = await web3Service.getEvents();
  //     setEvents(result.events);
  //   } catch (error) {
  //     console.error("Failed to load events:", error);
  //   }
  // };

  const handleCreateEvent = async (eventData) => {
    try {
      await web3Service.createEvent(eventData);
      await loadEvents();
      alert("Event created successfully!");
    } catch (error) {
      alert("Failed to create event: " + error.message);
    }
  };

  const handleIssueReward = async (rewardData) => {
    try {
      await web3Service.issueReward(
        rewardData.recipient,
        rewardData.amount,
        rewardData.reason
      );

      // OPTIMISTIC UPDATE
      setDashboardData((prev) => ({
        ...prev,
        totalTokens: prev.totalTokens + rewardData.amount,
        // optionally update leaderboard if the user is current wallet
        eventHistory: [
          ...prev.eventHistory,
          {
            eventName: rewardData.reason,
            eventType: "direct_reward",
            tokensEarned: rewardData.amount,
            certificateId: null,
          },
        ],
      }));

      alert("Reward issued successfully!");
    } catch (error) {
      alert("Failed to issue reward: " + error.message);
    }
  };

  const handleRecordAttendance = async ({ eventId, studentAddress }) => {
    try {
      await web3Service.recordAttendance(eventId, studentAddress);

      // find the event
      const event = events.find((e) => e.id === eventId);
      if (!event) return;

      // OPTIMISTIC UPDATE if current wallet matches
      if (studentAddress.toLowerCase() === walletAddress.toLowerCase()) {
        setDashboardData((prev) => ({
          ...prev,
          totalTokens: prev.totalTokens + event.rewardAmount,
          totalEvents: prev.totalEvents + 1,
          eventHistory: [
            ...prev.eventHistory,
            {
              eventName: event.name,
              eventType: event.type,
              tokensEarned: event.rewardAmount,
              certificateId: event.issueCertificate
                ? `CERT_${Date.now()}`
                : null,
            },
          ],
          credentials: prev.credentials + (event.issueCertificate ? 1 : 0),
          credentialsList: event.issueCertificate
            ? [
                ...prev.credentialsList,
                { id: `CERT_${Date.now()}`, name: event.name },
              ]
            : prev.credentialsList,
        }));
      }

      alert("Attendance recorded successfully!");
    } catch (error) {
      alert("Failed to record attendance: " + error.message);
    }
  };

  if (!isConnected) {
    return <ConnectWallet onConnect={handleConnect} />;
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  if (userRole === "admin" || userRole === "organizer") {
    tabs.push({
      id: "admin",
      label: userRole === "admin" ? "Admin" : "Manage",
      icon: Settings,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Student Rewards DApp
              </h1>
              <p className="text-sm text-gray-600">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} •{" "}
                {userRole}
              </p>
            </div>
            <button
              onClick={handleDisconnect}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && activeTab === "dashboard" ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <Dashboard dashboardData={dashboardData} />
            )}

            {activeTab === "leaderboard" && (
              <Leaderboard
                leaderboard={leaderboard}
                currentUser={walletAddress}
              />
            )}

            {activeTab === "admin" &&
              (userRole === "admin" || userRole === "organizer") && (
                <AdminPanel
                  userRole={userRole}
                  onCreateEvent={handleCreateEvent}
                  onIssueReward={handleIssueReward}
                  onRecordAttendance={handleRecordAttendance}
                  events={events}
                />
              )}
          </>
        )}
      </main>
    </div>
  );
}
