import { Coins, TrendingUp, Award } from "lucide-react";

export default function RewardCard({ balance, eventsParticipated }) {
  return (
    <div className="bg-indigo-700  rounded-3xl p-8 text-white shadow-2xl shadow-indigo-900/50 transform hover:scale-[1.01] transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Coins className="w-7 h-7" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-light opacity-80 uppercase tracking-wider">
              Total Rewards
            </p>
            <p className="text-xs font-light opacity-60">
              Student Reward Tokens
            </p>
          </div>
        </div>
        <Award className="w-10 h-10 opacity-30" />
      </div>

      <div className="mb-4">
        <h2 className="text-6xl font-extrabold mb-1 tracking-tight">
          {balance}
        </h2>
        <p className="text-lg font-medium opacity-90">SRT Tokens</p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/20">
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-300" />
          <span className="text-sm font-medium">
            {eventsParticipated} Events Attended
          </span>
        </div>
        <div className="px-4 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
          Active Status
        </div>
      </div>
    </div>
  );
}
