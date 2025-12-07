import { Award, Calendar, CheckCircle, Shield } from "lucide-react";

export default function CredentialCard({ credential }) {
  const typeColors = {
    workshop_attendance: "blue",
    competition_win: "yellow",
    hackathon_participation: "purple",
    volunteer_work: "green",
    certificate: "indigo",
  };

  const typeIcons = {
    workshop_attendance: Award,
    competition_win: Award,
    hackathon_participation: Shield,
    volunteer_work: CheckCircle,
    certificate: Award,
  };

  const color = typeColors[credential.metadata?.type] || "gray";
  const Icon = typeIcons[credential.metadata?.type] || Award;

  // Updated color styles for dark background
  const bgColors = {
    blue: "bg-gray-800 border-blue-600/30",
    yellow: "bg-gray-800 border-yellow-600/30",
    purple: "bg-gray-800 border-purple-600/30",
    green: "bg-gray-800 border-green-600/30",
    indigo: "bg-gray-800 border-indigo-600/30",
    gray: "bg-gray-800 border-gray-700",
  };

  const iconColors = {
    blue: "bg-blue-600/20 text-blue-400",
    yellow: "bg-yellow-600/20 text-yellow-400",
    purple: "bg-purple-600/20 text-purple-400",
    green: "bg-green-600/20 text-green-400",
    indigo: "bg-indigo-600/20 text-indigo-400",
    gray: "bg-gray-600/20 text-gray-400",
  };

  return (
    <div
      className={`border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 ${bgColors[color]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${iconColors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="px-2 py-0.5 bg-gray-700/50 border border-gray-600 rounded-full text-xs font-mono text-gray-400">
          ID: {credential.id.slice(0, 6)}...
        </span>
      </div>

      <h3 className="font-semibold text-white mb-1 line-clamp-2 text-lg">
        {credential.metadata?.title || "Achievement"}
      </h3>

      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
        {credential.metadata?.description || "No description provided"}
      </p>

      <div className="flex items-center text-xs text-gray-500">
        <Calendar className="w-3 h-3 mr-1.5 text-indigo-400" />
        <span>
          Issued:{" "}
          {credential.issuedAt
            ? new Date(credential.issuedAt).toLocaleDateString()
            : "N/A"}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Blockchain Verified
          </span>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      </div>
    </div>
  );
}
