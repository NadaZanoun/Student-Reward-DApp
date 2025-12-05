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

  const bgColors = {
    blue: "bg-blue-50 border-blue-200",
    yellow: "bg-yellow-50 border-yellow-200",
    purple: "bg-purple-50 border-purple-200",
    green: "bg-green-50 border-green-200",
    indigo: "bg-indigo-50 border-indigo-200",
    gray: "bg-gray-50 border-gray-200",
  };

  const iconColors = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    indigo: "bg-indigo-100 text-indigo-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      className={`border-2 rounded-xl p-5 transition-all hover:shadow-lg ${bgColors[color]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg ${iconColors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-600">
          #{credential.id}
        </span>
      </div>

      <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
        {credential.metadata?.title || "Achievement"}
      </h3>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {credential.metadata?.description || "No description"}
      </p>

      <div className="flex items-center text-xs text-gray-500">
        <Calendar className="w-3 h-3 mr-1" />
        <span>
          {credential.issuedAt
            ? new Date(credential.issuedAt).toLocaleDateString()
            : "N/A"}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Verified on Blockchain</span>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      </div>
    </div>
  );
}
