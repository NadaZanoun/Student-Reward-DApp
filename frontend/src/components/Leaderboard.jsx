import { Trophy, Medal, Award, Coins } from "lucide-react";

export default function Leaderboard({ leaderboard, currentUser }) {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <Award className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300";
      case 3:
        return "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Top Students
        </h2>
        <span className="text-sm text-gray-500">This Month</span>
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.address === currentUser;

          return (
            <div
              key={entry.address}
              className={`border-2 rounded-xl p-4 transition-all ${
                isCurrentUser ? "ring-2 ring-indigo-500 border-indigo-300" : ""
              } ${getRankBg(rank)}`}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 mr-4">
                  {rank <= 3 ? (
                    getRankIcon(rank)
                  ) : (
                    <span className="text-lg font-bold text-gray-500">
                      #{rank}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-semibold text-gray-900">
                      {shortenAddress(entry.address)}
                    </p>
                    {isCurrentUser && (
                      <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {entry.eventsParticipated || 0} events participated
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <Coins className="w-4 h-4 text-indigo-600 mr-1" />
                    <span className="text-xl font-bold text-gray-900">
                      {entry.tokens}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">SRT</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No rankings yet. Be the first!</p>
        </div>
      )}
    </div>
  );
}
