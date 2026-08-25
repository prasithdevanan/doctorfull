import React, { use, useContext, useEffect, useState } from 'react';
import { AppContext } from '../component/CreateContext';
import { socket } from '../socket/socket';


function Notification() {
  const { data } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // Mark as seen
  useEffect(() => {
    if (!data || !data.length) return setLoading(false);
    const ids = data.map((data) => data.notificationId);
    socket.emit("user_seen", { notificationId: ids });
    setLoading(false);
  }, [data]);

  return (
    <>
      <div className="min-h-[calc(100vh-82px)] bg-gray-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">

          {/* Header */}
          <div className="mb-5 sm:mb-6">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Stay updated with your appointment activity
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[300px] w-full items-center justify-center">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                <span className="text-sm font-medium">
                  Loading notifications...
                </span>
              </div>
            </div>
          ) : data?.length === 0 ? (
            /* Empty */
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-10 text-center shadow-sm sm:px-10">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <i className="bi bi-bell text-2xl text-blue-600" />
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                No notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                You don't have any appointment notifications yet.
              </p>
            </div>
          ) : (
            /* Notifications */
            <div className="space-y-3">
              {data.map((item, index) => {
                const isAccepted = item.status === "Accepted";
                const isRejected = item.status === "Rejected";

                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md sm:p-5"
                  >
                    {/* Status line */}
                    <div
                      className={`absolute left-0 top-0 h-full w-1 ${isAccepted
                          ? "bg-green-500"
                          : isRejected
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                    />

                    {/* Main */}
                    <div className="pl-2">

                      {/* Top section */}
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        {/* Patient + icon */}
                        <div className="flex min-w-0 items-start gap-3 sm:gap-4">

                          {/* Icon */}
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${isAccepted
                                ? "bg-green-50 text-green-600"
                                : isRejected
                                  ? "bg-red-50 text-red-600"
                                  : "bg-yellow-50 text-yellow-600"
                              }`}
                          >
                            <i className="bi bi-calendar-check text-lg sm:text-xl" />
                          </div>

                          {/* Patient */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <h2 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                                {item.details.data.patientName}
                              </h2>

                              <span className="text-xs font-medium text-gray-400">
                                Appointment
                              </span>
                            </div>

                            {/* Date + Time */}
                            <div className="mt-2.5 flex flex-wrap gap-2 sm:mt-3">

                              {/* Date */}
                              <div className="flex min-w-0 items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 sm:px-3 sm:py-2">
                                <i className="bi bi-calendar3 shrink-0 text-sm text-blue-600 sm:text-base" />

                                <div className="min-w-0">
                                  <p className="text-[10px] leading-none text-gray-400 sm:text-xs">
                                    Date
                                  </p>

                                  <p className="mt-0.5 truncate text-xs font-medium text-gray-700 sm:text-sm">
                                    {item.details.data.appointmentDate}
                                  </p>
                                </div>
                              </div>

                              {/* Time */}
                              <div className="flex min-w-0 items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 sm:px-3 sm:py-2">
                                <i className="bi bi-clock shrink-0 text-sm text-purple-600 sm:text-base" />

                                <div className="min-w-0">
                                  <p className="text-[10px] leading-none text-gray-400 sm:text-xs">
                                    Time
                                  </p>

                                  <p className="mt-0.5 truncate text-xs font-medium text-gray-700 sm:text-sm">
                                    {item.details.data.appointmentTime}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Desktop right section */}
                        <div className="hidden shrink-0 items-center gap-4 lg:flex">

                          {/* Notification time */}
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <i className="bi bi-clock-history text-sm" />

                            <span className="text-xs whitespace-nowrap xl:text-sm">
                              {new Date(
                                item.details.createdAt
                              ).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>

                          {/* Status */}
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap xl:text-sm ${isAccepted
                                ? "border-green-100 bg-green-50 text-green-700"
                                : isRejected
                                  ? "border-red-100 bg-red-50 text-red-600"
                                  : "border-yellow-100 bg-yellow-50 text-yellow-700"
                              }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${isAccepted
                                  ? "bg-green-500"
                                  : isRejected
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }`}
                            />

                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* Mobile / Tablet bottom section */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 lg:hidden">

                        {/* Notification time */}
                        <div className="flex min-w-0 items-center gap-1.5 text-gray-400">
                          <i className="bi bi-clock-history shrink-0 text-xs" />

                          <span className="truncate text-xs sm:text-sm">
                            {new Date(
                              item.details.createdAt
                            ).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>

                        {/* Status */}
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${isAccepted
                              ? "border-green-100 bg-green-50 text-green-700"
                              : isRejected
                                ? "border-red-100 bg-red-50 text-red-600"
                                : "border-yellow-100 bg-yellow-50 text-yellow-700"
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${isAccepted
                                ? "bg-green-500"
                                : isRejected
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }`}
                          />

                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Notification;