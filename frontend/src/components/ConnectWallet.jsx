import { Wallet, AlertCircle, ExternalLink } from "lucide-react";

export default function ConnectWallet({ onConnect, loading }) {
  const handleConnect = async () => {
    if (typeof window.ethereum === "undefined") {
      alert(
        "MetaMask is not installed. Please install MetaMask to use this DApp."
      );
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    await onConnect();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-indigo-500/10 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-xl mb-4 shadow-lg">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
              Student Rewards DApp
            </h1>
            <p className="text-gray-400 text-sm">
              Blockchain-verified credentials for achievements
            </p>
          </div>

          <div className="mb-6 p-4 bg-indigo-900/30 border border-indigo-700/50 rounded-lg">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-300 font-semibold mb-1">
                  MetaMask Required
                </p>
                <p className="text-xs text-indigo-400">
                  Connect to Sepolia testnet to access your dashboard.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-indigo-500/30"
          >
            {loading ? (
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

          <div className="space-y-3 pt-6 border-t border-gray-700 mt-6">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Setup Guide:
            </p>

            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm text-gray-300">1. Install MetaMask</span>
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </a>

            <a
              href="https://sepoliafaucet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm text-gray-300">
                2. Get Sepolia ETH (Faucet)
              </span>
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </a>

            <div className="p-3 bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-300">
                3. Switch to Sepolia Network
              </span>
              <p className="text-xs text-gray-500 mt-1">
                The DApp may prompt you to switch automatically.
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-600 text-center mt-6">
            Secured by the Ethereum Blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
