import { useState } from "react";
import { Plus, Calendar, Users, Gift, Award, X } from "lucide-react";

export default function AdminPanel({
  userRole,
  onCreateEvent,
  onIssueReward,
  onRecordAttendance,
  events,
}) {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const [eventForm, setEventForm] = useState({
    name: "",
    type: "workshop_attendance",
    description: "",
    rewardAmount: 50,
    issueCertificate: true,
  });

  const [rewardForm, setRewardForm] = useState({
    recipient: "",
    amount: 0,
    reason: "",
  });

  const [attendanceForm, setAttendanceForm] = useState({
    eventId: "",
    studentAddress: "",
  });

  const eventTypes = [
    { value: "workshop_attendance", label: "Workshop" },
    { value: "competition_participation", label: "Competition" },
    { value: "hackathon_participation", label: "Hackathon" },
    { value: "volunteer_work", label: "Volunteer Work" },
    { value: "club_contribution", label: "Club Activity" },
  ];

  const handleCreateEvent = () => {
    onCreateEvent(eventForm);
    setEventForm({
      name: "",
      type: "workshop_attendance",
      description: "",
      rewardAmount: 50,
      issueCertificate: true,
    });
    setShowEventModal(false);
  };

  const handleIssueReward = () => {
    onIssueReward(rewardForm);
    setRewardForm({ recipient: "", amount: 0, reason: "" });
    setShowRewardModal(false);
  };

  const handleRecordAttendance = () => {
    onRecordAttendance(attendanceForm);
    setAttendanceForm({ eventId: "", studentAddress: "" });
    setShowAttendanceModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {userRole === "admin" ? "Admin Panel" : "Organizer Panel"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => setShowEventModal(true)}
          className="p-6 bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
        >
          <Plus className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 mx-auto mb-2" />
          <p className="font-medium text-gray-700 group-hover:text-indigo-900">
            Create Event
          </p>
        </button>

        {userRole === "admin" && (
          <button
            onClick={() => setShowRewardModal(true)}
            className="p-6 bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <Gift className="w-8 h-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-700 group-hover:text-green-900">
              Issue Reward
            </p>
          </button>
        )}

        <button
          onClick={() => setShowAttendanceModal(true)}
          className="p-6 bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          <Users className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
          <p className="font-medium text-gray-700 group-hover:text-blue-900">
            Record Attendance
          </p>
        </button>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Create Event</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Name"
                value={eventForm.name}
                onChange={(e) =>
                  setEventForm({ ...eventForm, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />

              <select
                value={eventForm.type}
                onChange={(e) =>
                  setEventForm({ ...eventForm, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Description"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
              />

              <input
                type="number"
                placeholder="Reward Amount"
                value={eventForm.rewardAmount}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    rewardAmount: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={eventForm.issueCertificate}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      issueCertificate: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Issue Certificate
                </span>
              </label>

              <button
                onClick={handleCreateEvent}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Issue Direct Reward
              </h3>
              <button
                onClick={() => setShowRewardModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Recipient Address"
                value={rewardForm.recipient}
                onChange={(e) =>
                  setRewardForm({ ...rewardForm, recipient: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />

              <input
                type="number"
                placeholder="Token Amount"
                value={rewardForm.amount}
                onChange={(e) =>
                  setRewardForm({
                    ...rewardForm,
                    amount: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />

              <textarea
                placeholder="Reason"
                value={rewardForm.reason}
                onChange={(e) =>
                  setRewardForm({ ...rewardForm, reason: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
              />

              <button
                onClick={handleIssueReward}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
              >
                Issue Reward
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Record Attendance
              </h3>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <select
                value={attendanceForm.eventId}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    eventId: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Event</option>
                {events
                  .filter((e) => e.active)
                  .map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({event.rewardAmount} SRT)
                    </option>
                  ))}
              </select>

              <input
                type="text"
                placeholder="Student Address"
                value={attendanceForm.studentAddress}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    studentAddress: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <button
                onClick={handleRecordAttendance}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Record Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
