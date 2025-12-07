import { useState } from "react";
import { Plus, Calendar, Users, X, Copy, Check } from "lucide-react";

export default function AdminPanel({
  isAdmin,
  onCreateEvent,
  onRecordAttendance,
  onRecordMultipleAttendance,
  events,
}) {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [eventForm, setEventForm] = useState({
    name: "",
    type: "workshop_attendance",
    description: "",
    rewardAmount: 50,
    issueCertificate: true,
  });

  const [attendanceForm, setAttendanceForm] = useState({
    eventId: "",
    studentAddress: "",
  });

  const [bulkForm, setBulkForm] = useState({
    eventId: "",
    addresses: "",
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

  const handleRecordAttendance = () => {
    onRecordAttendance(attendanceForm);
    setAttendanceForm({ eventId: "", studentAddress: "" });
    setShowAttendanceModal(false);
  };

  const handleBulkAttendance = () => {
    const addresses = bulkForm.addresses
      .split("\n")
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0);

    if (addresses.length === 0) {
      alert("Please enter at least one address");
      return;
    }

    onRecordMultipleAttendance(bulkForm.eventId, addresses);
    setBulkForm({ eventId: "", addresses: "" });
    setShowBulkModal(false);
  };

  const copyEventLink = (eventId) => {
    const link = `${window.location.origin}?event=${eventId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 bg-gray-900 min-h-screen p-6 lg:p-8">
      <div className="flex items-center justify-between pb-2 border-b border-gray-800">
        <h2 className="text-3xl font-bold text-white">
          {isAdmin ? "Admin Panel" : "Organizer Panel"}
        </h2>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setShowEventModal(true)}
          className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all duration-200 group shadow-md"
        >
          <Plus className="w-8 h-8 text-gray-400 group-hover:text-indigo-400 mx-auto mb-2" />
          <p className="font-semibold text-white group-hover:text-indigo-300">
            Create Event
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Define rewards and certificate options
          </p>
        </button>

        <button
          onClick={() => setShowAttendanceModal(true)}
          className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200 group shadow-md"
        >
          <Users className="w-8 h-8 text-gray-400 group-hover:text-blue-400 mx-auto mb-2" />
          <p className="font-semibold text-white group-hover:text-blue-300">
            Single Attendance
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Record attendance for one student
          </p>
        </button>

        <button
          onClick={() => setShowBulkModal(true)}
          className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-green-500 hover:bg-green-500/10 transition-all duration-200 group shadow-md"
        >
          <Calendar className="w-8 h-8 text-gray-400 group-hover:text-green-400 mx-auto mb-2" />
          <p className="font-semibold text-white group-hover:text-green-300">
            Bulk Attendance
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Record attendance for multiple students
          </p>
        </button>
      </div>

      {/* Events List */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-3">
          Your Events
        </h3>

        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  event.active
                    ? "border-green-600/30 bg-gray-700/50 hover:bg-gray-700"
                    : "border-gray-700 bg-gray-700/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-white text-lg">
                        {event.name}
                      </h4>
                      <span
                        className={`px-3 py-0.5 text-xs rounded-full font-medium tracking-wide ${
                          event.active
                            ? "bg-green-600/20 text-green-400 border border-green-600/50"
                            : "bg-gray-600/20 text-gray-400 border border-gray-600/50"
                        }`}
                      >
                        {event.active ? "ACTIVE" : "CLOSED"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="font-semibold text-indigo-400">
                        {event.rewardAmount} SRT Reward
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="capitalize">
                        {event.type.replace(/_/g, " ")}
                      </span>
                      {event.issueCertificate && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="text-blue-400">
                            <Check className="w-3 h-3 inline mr-1" />
                            Certificate
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => copyEventLink(event.id)}
                    className="ml-4 p-2 text-gray-500 hover:text-indigo-400 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Copy event link"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-14 h-14 mx-auto mb-4 text-gray-700" />
            <p className="text-lg font-medium">No events created yet.</p>
            <p className="text-sm text-gray-600 mt-1">
              Use the "Create Event" card to get started.
            </p>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
              <h3 className="text-xl font-bold text-white">Create New Event</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventForm.name}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Introduction to Blockchain"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Event Type
                </label>
                <select
                  value={eventForm.type}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, type: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {eventTypes.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      className="bg-gray-800"
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  placeholder="Event details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Reward Amount (SRT)
                </label>
                <input
                  type="number"
                  value={eventForm.rewardAmount}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      rewardAmount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <label className="flex items-center pt-2">
                <input
                  type="checkbox"
                  checked={eventForm.issueCertificate}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      issueCertificate: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-indigo-500 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-300">
                  Issue NFT Certificate
                </span>
              </label>

              <button
                onClick={handleCreateEvent}
                disabled={!eventForm.name || !eventForm.description}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors mt-4"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
              <h3 className="text-xl font-bold text-white">
                Record Single Attendance
              </h3>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Select Active Event
                </label>
                <select
                  value={attendanceForm.eventId}
                  onChange={(e) =>
                    setAttendanceForm({
                      ...attendanceForm,
                      eventId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" className="bg-gray-800">
                    Choose an event
                  </option>
                  {events
                    .filter((e) => e.active)
                    .map((event) => (
                      <option
                        key={event.id}
                        value={event.id}
                        className="bg-gray-800"
                      >
                        {event.name} ({event.rewardAmount} SRT)
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Student Wallet Address
                </label>
                <input
                  type="text"
                  value={attendanceForm.studentAddress}
                  onChange={(e) =>
                    setAttendanceForm({
                      ...attendanceForm,
                      studentAddress: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="0x..."
                />
              </div>

              <button
                onClick={handleRecordAttendance}
                disabled={
                  !attendanceForm.eventId || !attendanceForm.studentAddress
                }
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Record Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Attendance Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
              <h3 className="text-xl font-bold text-white">
                Bulk Record Attendance
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Select Active Event
                </label>
                <select
                  value={bulkForm.eventId}
                  onChange={(e) =>
                    setBulkForm({ ...bulkForm, eventId: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="" className="bg-gray-800">
                    Choose an event
                  </option>
                  {events
                    .filter((e) => e.active)
                    .map((event) => (
                      <option
                        key={event.id}
                        value={event.id}
                        className="bg-gray-800"
                      >
                        {event.name} ({event.rewardAmount} SRT)
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Student Addresses (one per line)
                </label>
                <textarea
                  value={bulkForm.addresses}
                  onChange={(e) =>
                    setBulkForm({ ...bulkForm, addresses: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                  rows="8"
                  placeholder="0x123...&#10;0x456...&#10;0x789..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {
                    bulkForm.addresses.split("\n").filter((a) => a.trim())
                      .length
                  }{" "}
                  addresses ready
                </p>
              </div>

              <button
                onClick={handleBulkAttendance}
                disabled={!bulkForm.eventId || !bulkForm.addresses.trim()}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Record All Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
