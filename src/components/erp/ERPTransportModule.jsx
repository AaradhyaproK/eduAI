import React, { useState, useEffect } from "react";
import { IconTransport, IconBus, IconNotice, IconShield, IconCheck, IconClock } from "./ERPIcons";

export default function ERPTransportModule({ erpData }) {
  const [selectedRouteId, setSelectedRouteId] = useState("BUS-01");
  const [busProgress, setBusProgress] = useState(45);
  const [busSpeed, setBusSpeed] = useState(38);
  const [alertMessage, setAlertMessage] = useState(null);

  const routes = erpData.transportRoutes || [];
  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setBusSpeed((prev) => Math.floor(32 + Math.random() * 14));
      setBusProgress((prev) => (prev >= 90 ? 20 : prev + 2));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerSOS = () => {
    setAlertMessage({
      type: "danger",
      text: `PRIORITY SOS: Driver ${currentRoute.driverName} (${currentRoute.busNumber}) triggered emergency beacon. Campus security and patrol unit dispatched.`
    });
  };

  const handleBroadcastDelay = () => {
    setAlertMessage({
      type: "warning",
      text: `TRAFFIC DELAY ADVISORY: Automated SMS broadcast dispatched to 38 registered guardians on ${currentRoute.name} for ~10 min traffic delay.`
    });
  };

  return (
    <div className="erp-transport-module animate-fade-in">
      {/* Module Title */}
      <div className="card border rounded-3 p-4 mb-4 bg-white shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h5 className="fw-bold mb-1 text-dark">Fleet Telemetry & Campus Transport Operations</h5>
            <p className="text-muted small mb-0">
              Live GPS route monitoring, passenger capacity, driver safety logs, and automated route delay broadcasts.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-warning text-dark fw-medium rounded-2 px-3"
              onClick={handleBroadcastDelay}
            >
              Broadcast Delay SMS
            </button>
            <button
              className="btn btn-sm btn-danger fw-medium rounded-2 px-3"
              onClick={handleTriggerSOS}
            >
              Simulate SOS Beacon
            </button>
          </div>
        </div>

        {alertMessage && (
          <div className={`alert alert-${alertMessage.type} small py-2 rounded-2 mt-3 mb-0 d-flex justify-content-between align-items-center`}>
            <span>{alertMessage.text}</span>
            <button type="button" className="btn-close btn-close-sm" onClick={() => setAlertMessage(null)}></button>
          </div>
        )}
      </div>

      {/* Fleet Overview Cards */}
      <div className="row g-3 mb-4">
        {routes.map((rt) => (
          <div key={rt.id} className="col-lg-3 col-sm-6">
            <div
              className={`card border rounded-3 p-3 cursor-pointer transition-all ${
                selectedRouteId === rt.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-dark shadow-xs hover-elevate"
              }`}
              onClick={() => setSelectedRouteId(rt.id)}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className={`p-1 rounded-1 ${selectedRouteId === rt.id ? "bg-white text-primary" : "bg-primary-subtle text-primary"}`}>
                  <IconBus size={16} />
                </div>
                <span
                  className={`badge rounded-1 small ${
                    selectedRouteId === rt.id
                      ? "bg-white text-primary"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                  style={{ fontSize: "0.72rem" }}
                >
                  {rt.status}
                </span>
              </div>
              <h6 className="fw-bold mb-1" style={{ fontSize: "0.92rem" }}>{rt.busNumber}</h6>
              <p className={`small mb-2 ${selectedRouteId === rt.id ? "opacity-90" : "text-muted"}`} style={{ fontSize: "0.78rem" }}>
                {rt.name.split("(")[0]}
              </p>
              <div className="d-flex justify-content-between small pt-2 border-top" style={{ fontSize: "0.75rem" }}>
                <span>Occupancy:</span>
                <strong>
                  {rt.occupancy} / {rt.capacity} Seats
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Route Telemetry & Map Visualizer */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border rounded-3 p-4 bg-white mb-4 shadow-xs">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-bold mb-0 text-dark small">Live Route Progression & Waypoint Timeline</h6>
                <span className="text-muted small" style={{ fontSize: "0.75rem" }}>Vehicle telemetry updating continuously</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 small">
                  Live GPS Signal
                </span>
                <span className="badge bg-slate-900 text-white font-monospace small">
                  {busSpeed} km/h
                </span>
              </div>
            </div>

            {/* Road Path Visualizer */}
            <div className="p-4 bg-slate-50 rounded-3 border mb-4 position-relative overflow-hidden">
              <div className="d-flex justify-content-between small text-muted mb-2" style={{ fontSize: "0.75rem" }}>
                <span>Origin: {currentRoute.stops[0]?.name}</span>
                <span>Destination: Greenwood Main Campus</span>
              </div>

              {/* Progress Line */}
              <div className="progress mb-4" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${busProgress}%` }}
                ></div>
              </div>

              {/* Stops Waypoints */}
              <div className="d-flex justify-content-between position-relative">
                {currentRoute.stops.map((stop, idx) => (
                  <div key={stop.name} className="text-center" style={{ maxWidth: "120px" }}>
                    <div
                      className={`rounded-circle mx-auto d-flex align-items-center justify-content-center mb-1 ${
                        stop.passed
                          ? "bg-emerald-600 text-white"
                          : idx === currentRoute.currentStopIndex
                          ? "bg-primary text-white"
                          : "bg-white text-muted border"
                      }`}
                      style={{ width: "26px", height: "26px", fontSize: "0.75rem" }}
                    >
                      {stop.passed ? "✓" : idx + 1}
                    </div>
                    <div className="fw-medium text-dark" style={{ fontSize: "0.72rem" }}>
                      {stop.name}
                    </div>
                    <div className="text-muted font-monospace" style={{ fontSize: "0.68rem" }}>
                      {stop.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Stops Breakdown Table */}
            <h6 className="fw-bold text-dark mb-2 small">Waypoint Timetable Schedule</h6>
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle mb-0 small">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-3 text-muted fw-semibold">Stop #</th>
                    <th className="text-muted fw-semibold">Designated Landmark</th>
                    <th className="text-muted fw-semibold">Scheduled Arrival</th>
                    <th className="text-muted fw-semibold">Transit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRoute.stops.map((st, i) => (
                    <tr key={st.name}>
                      <td className="ps-3 fw-semibold text-secondary font-monospace">{i + 1}</td>
                      <td className="fw-medium text-dark">{st.name}</td>
                      <td className="font-monospace text-muted">{st.time}</td>
                      <td>
                        <span
                          className={`badge rounded-1 small ${
                            st.passed ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                          style={{ fontSize: "0.72rem" }}
                        >
                          {st.passed ? "Completed" : "Approaching"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Driver Profile & Fleet Specifications */}
        <div className="col-lg-4">
          <div className="card border rounded-3 p-4 bg-white mb-4 shadow-xs">
            <h6 className="fw-bold text-dark mb-3 small">Driver & Fleet Specifications</h6>

            <div className="p-3 bg-slate-50 border rounded-2 mb-3">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: "42px", height: "42px" }}
                >
                  <IconBus size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark small">{currentRoute.driverName}</h6>
                  <span className="text-muted small" style={{ fontSize: "0.75rem" }}>Certified Senior Fleet Captain</span>
                </div>
              </div>

              <ul className="list-group list-group-flush small bg-transparent">
                <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                  <span className="text-muted">Driver Contact</span>
                  <span className="fw-medium text-dark font-monospace">{currentRoute.driverPhone}</span>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                  <span className="text-muted">Registration</span>
                  <span className="fw-medium text-dark font-monospace">{currentRoute.busNumber}</span>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                  <span className="text-muted">Speed Governor</span>
                  <span className="text-success fw-medium">Active (45 km/h cap)</span>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                  <span className="text-muted">First Aid & Fire Ext.</span>
                  <span className="text-success fw-medium">Certified Today</span>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                  <span className="text-muted">CCTV Surveillance</span>
                  <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">Dual Cameras Live</span>
                </li>
              </ul>
            </div>

            <div className="p-3 border rounded-2 text-center bg-white">
              <span className="small text-muted d-block mb-1" style={{ fontSize: "0.75rem" }}>Fleet Control Dispatch</span>
              <strong className="text-primary font-monospace small">+91 80 2845 9010</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
