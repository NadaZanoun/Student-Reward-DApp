import { Calendar, Award, History, TrendingUp } from "lucide-react";
import RewardCard from "./RewardCard";
import CredentialCard from "./CredentialCard";

export default function Dashboard({ dashboardData }) {
  const {
    totalTokens,
    credentials,
    credentialsList,
    eventHistory,
    totalEvents,
  } = dashboardData;

  return (
    <div className="space-y-8 bg-gray-900 min-h-screen p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RewardCard balance={totalTokens} eventsParticipated={totalEvents} />
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-white mb-5 border-b border-gray-700 pb-3">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-indigo-500 mr-3" />
                <span className="text-gray-400 font-medium">
                  Credentials Earned
                </span>
              </div>
              <span className="font-extrabold text-white text-lg">
                {credentials}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-400 font-medium">
                  Events Participated
                </span>
              </div>
              <span className="font-extrabold text-white text-lg">
                {totalEvents}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-gray-400 font-medium">
                  Avg SRT per Event
                </span>
              </div>
              <span className="font-extrabold text-white text-lg">
                {totalEvents > 0 ? Math.round(totalTokens / totalEvents) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Award className="w-6 h-6 mr-3 text-indigo-500" />
            My Credentials
          </h2>
          <span className="text-sm text-gray-500 font-semibold">
            {credentials} total
          </span>
        </div>

        {credentialsList && credentialsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentialsList.map((credential) => (
              <CredentialCard key={credential.id} credential={credential} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Award className="w-14 h-14 mx-auto mb-4 text-gray-700" />
            <p className="text-lg font-medium">No credentials yet.</p>
            <p className="text-sm text-gray-600 mt-1">
              Participate in events to earn blockchain-verified badges!
            </p>
          </div>
        )}
      </div>

      {/* Event History Section */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <History className="w-6 h-6 mr-3 text-gray-500" />
            Event History
          </h2>
        </div>

        {eventHistory && eventHistory.length > 0 ? (
          <div className="space-y-4">
            {eventHistory.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
              >
                <div className="flex items-center flex-1">
                  <div className="p-3 bg-indigo-500/20 rounded-lg mr-4">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      {event.eventName}
                    </h4>
                    <p className="text-sm text-gray-400 capitalize">
                      {event.eventType.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-400 text-lg">
                    +{event.tokensEarned} SRT
                  </p>
                  {event.certificateId && (
                    <p className="text-xs text-blue-400 font-medium">
                      Certificate Issued
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-14 h-14 mx-auto mb-4 text-gray-700" />
            <p className="text-lg font-medium">No event history yet.</p>
            <p className="text-sm text-gray-600 mt-1">
              Start participating to see your activity!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
