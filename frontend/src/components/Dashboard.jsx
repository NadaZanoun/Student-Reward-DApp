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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RewardCard balance={totalTokens} eventsParticipated={totalEvents} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-indigo-600 mr-2" />
                <span className="text-gray-700">Credentials</span>
              </div>
              <span className="font-bold text-gray-900">{credentials}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-gray-700">Events</span>
              </div>
              <span className="font-bold text-gray-900">{totalEvents}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-gray-700">Avg per Event</span>
              </div>
              <span className="font-bold text-gray-900">
                {totalEvents > 0 ? Math.round(totalTokens / totalEvents) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Award className="w-6 h-6 mr-2 text-indigo-600" />
            My Credentials
          </h2>
          <span className="text-sm text-gray-500">{credentials} total</span>
        </div>

        {credentialsList && credentialsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentialsList.map((credential) => (
              <CredentialCard key={credential.id} credential={credential} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No credentials yet. Participate in events to earn badges!</p>
          </div>
        )}
      </div>

      {/* Event History Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <History className="w-6 h-6 mr-2 text-gray-600" />
            Event History
          </h2>
        </div>

        {eventHistory && eventHistory.length > 0 ? (
          <div className="space-y-3">
            {eventHistory.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center flex-1">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {event.eventName}
                    </h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {event.eventType.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-indigo-600">
                    +{event.tokensEarned} SRT
                  </p>
                  {event.certificateId && (
                    <p className="text-xs text-green-600">Certificate Issued</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>
              No event history yet. Start participating to see your activity!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
