import { useState, useEffect } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import { LogOut, Home, Trophy, Settings, Loader } from "lucide-react";
import web3Service from "./utils/web3";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    totalTokens: 0,
    credentials: 0,
    credentialsList: [],
    totalEvents: 0,
    eventIds: [],
  });

  const [events, setEvents] = useState([]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const address = await web3Service.init();
      setWalletAddress(address);

      const networkInfo = await web3Service.getNetwork();
      setNetwork(networkInfo);

      // Pass the address explicitly to ensure we're checking the new account
      const admin = await web3Service.isAdmin(address);
      const organizer = await web3Service.isOrganizer(address);

      setIsAdmin(admin);
      setIsOrganizer(organizer);
      setIsConnected(true);

      await loadData();
    } catch (error) {
      console.error("Connection error:", error);
      alert(error.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashboard, allEvents] = await Promise.all([
        web3Service.getDashboardData(),
        web3Service.getAllEvents(),
      ]);

      setDashboardData(dashboard);
      setEvents(allEvents);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    setIsAdmin(false);
    setIsOrganizer(false);
    setActiveTab("dashboard");
    window.location.reload();
  };

  const handleCreateEvent = async (eventData) => {
    setLoading(true);
    try {
      await web3Service.createEvent(eventData);
      await loadData();
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAttendance = async (attendanceData) => {
    setLoading(true);
    try {
      await web3Service.recordAttendance(
        attendanceData.eventId,
        attendanceData.studentAddress
      );
      await loadData();
      alert("Attendance recorded successfully!");
    } catch (error) {
      console.error("Error recording attendance:", error);
      alert("Failed to record attendance: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRecordMultipleAttendance = async (eventId, students) => {
    setLoading(true);
    try {
      await web3Service.recordMultipleAttendance(eventId, students);
      await loadData();
      alert(`Attendance recorded for ${students.length} students!`);
    } catch (error) {
      console.error("Error recording multiple attendance:", error);
      alert("Failed to record attendance: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <ConnectWallet onConnect={handleConnect} loading={loading} />;
  }

  const tabs = [{ id: "dashboard", label: "Dashboard", icon: Home }];

  if (isAdmin || isOrganizer) {
    tabs.push({
      id: "admin",
      label: isAdmin ? "Admin" : "Manage",
      icon: Settings,
    });
  }

  const getNetworkName = () => {
    if (!network) return "";
    const names = {
      1: "Ethereum Mainnet",
      11155111: "Sepolia Testnet",
      1337: "Local Network",
    };
    return names[network.chainId] || `Chain ${network.chainId}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Student Rewards DApp
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-gray-400 font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
                {network && (
                  <>
                    <span className="text-gray-600">•</span>
                    <p className="text-sm text-gray-500">{getNetworkName()}</p>
                  </>
                )}
                {(isAdmin || isOrganizer) && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="px-2 py-0.5 bg-indigo-600/30 text-indigo-300 text-xs rounded-full font-medium border border-indigo-500/50">
                      {isAdmin ? "Admin" : "Organizer"}
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="flex items-center px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
            >
              <LogOut className="w-5 h-5 mr-2 text-gray-400" />
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
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
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-gray-400 hover:text-white hover:border-gray-500"
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

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
            <Loader className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-white font-semibold text-lg">
              Processing transaction...
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Please confirm in MetaMask
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <Dashboard dashboardData={dashboardData} />
        )}

        {activeTab === "admin" && (isAdmin || isOrganizer) && (
          <AdminPanel
            isAdmin={isAdmin}
            onCreateEvent={handleCreateEvent}
            onRecordAttendance={handleRecordAttendance}
            onRecordMultipleAttendance={handleRecordMultipleAttendance}
            events={events}
          />
        )}
      </main>
    </div>
  );
}
