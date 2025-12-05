import { useState } from "react";
import { Wallet, User, Shield, Users, Import } from "lucide-react";
import { web3Service } from "../utils/web3";

export default function ConnectWallet({ onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");

  const roles = [
    { id: "student", label: "Student", icon: User, color: "blue" },
    { id: "organizer", label: "Event Organizer", icon: Users, color: "green" },
    { id: "admin", label: "Admin", icon: Shield, color: "purple" },
  ];

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const account = await web3Service.connectWallet();
      web3Service.setUserRole(selectedRole);
      onConnect(account, selectedRole);
      console.log("WEB3 ACCOUNT: ", web3Service.getCurrentAccount());
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Wallet className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student Rewards
            </h1>
            <p className="text-gray-600">Connect your wallet to get started</p>
          </div>

          <div className="space-y-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Role
            </label>
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full flex items-center p-4 rounded-lg border-2 transition-all ${
                    selectedRole === role.id
                      ? `border-${role.color}-500 bg-${role.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      selectedRole === role.id
                        ? `bg-${role.color}-100`
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        selectedRole === role.id
                          ? `text-${role.color}-600`
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <span
                    className={`ml-3 font-medium ${
                      selectedRole === role.id
                        ? `text-${role.color}-900`
                        : "text-gray-700"
                    }`}
                  >
                    {role.label}
                  </span>
                  {selectedRole === role.id && (
                    <div
                      className={`ml-auto w-5 h-5 rounded-full bg-${role.color}-500 flex items-center justify-center`}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            In production, this would connect to MetaMask or other Web3 wallets
          </p>
        </div>
      </div>
    </div>
  );
}
