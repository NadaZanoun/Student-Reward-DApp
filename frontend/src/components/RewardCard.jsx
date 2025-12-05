import { Coins, TrendingUp, Award } from "lucide-react";

export default function RewardCard({ balance, eventsParticipated }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
            <Coins className="w-6 h-6" />
          </div>
          <div className="ml-3">
            <p className="text-sm opacity-90">Total Rewards</p>
            <p className="text-xs opacity-75">Student Reward Tokens</p>
          </div>
        </div>
        <Award className="w-8 h-8 opacity-50" />
      </div>

      <div className="mb-4">
        <h2 className="text-5xl font-bold mb-1">{balance}</h2>
        <p className="text-sm opacity-90">SRT Tokens</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
        <div className="flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          <span className="text-sm">{eventsParticipated} Events Attended</span>
        </div>
        <div className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium backdrop-blur-sm">
          Active
        </div>
      </div>
    </div>
  );
}
