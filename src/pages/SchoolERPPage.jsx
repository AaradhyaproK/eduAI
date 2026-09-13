import React, { useState, useEffect } from "react";
import ERPHeader from "../components/erp/ERPHeader";
import ERPDashboardOverview from "../components/erp/ERPDashboardOverview";
import ERPSISModule from "../components/erp/ERPSISModule";
import ERPAttendanceModule from "../components/erp/ERPAttendanceModule";
import ERPAcademicsModule from "../components/erp/ERPAcademicsModule";
import ERPFinanceModule from "../components/erp/ERPFinanceModule";
import ERPTransportModule from "../components/erp/ERPTransportModule";
import ERPLibraryModule from "../components/erp/ERPLibraryModule";
import ERPStaffModule from "../components/erp/ERPStaffModule";
import ERPNoticesModule from "../components/erp/ERPNoticesModule";
import ERPParentPortal from "../components/erp/ERPParentPortal";
import ERPAnalyticsAndDocsModule from "../components/erp/ERPAnalyticsAndDocsModule";

import {
  IconDashboard,
  IconStudents,
  IconAttendance,
  IconAcademics,
  IconFinance,
  IconTransport,
  IconLibrary,
  IconStaff,
  IconNotice,
  IconParent,
  IconAward
} from "../components/erp/ERPIcons";

import { getERPState } from "../services/erpStorage";

export default function SchoolERPPage() {
  const [erpData, setErpData] = useState(getERPState());
  const [activeRole, setActiveRole] = useState("admin"); // admin | teacher | student | parent | finance | library | transport
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  const refreshState = () => {
    setErpData(getERPState());
  };

  useEffect(() => {
    refreshState();
    // Scroll to top upon mounting dedicated ERP
    window.scrollTo(0, 0);
  }, []);

  const handleRoleChange = (roleId) => {
    setActiveRole(roleId);
    if (roleId === "parent") {
      setActiveTab("parent");
    } else if (roleId === "teacher") {
      setActiveTab("attendance");
    } else if (roleId === "student") {
      setActiveTab("academics");
    } else if (roleId === "finance") {
      setActiveTab("finance");
    } else if (roleId === "library") {
      setActiveTab("library");
    } else if (roleId === "transport") {
      setActiveTab("transport");
    } else {
      setActiveTab("overview");
    }
  };

  const navTabs = [
    { id: "overview", label: "Executive Dashboard", icon: <IconDashboard size={16} /> },
    { id: "sis", label: "Students & Admissions", icon: <IconStudents size={16} /> },
    { id: "attendance", label: "Attendance & RFID", icon: <IconAttendance size={16} /> },
    { id: "academics", label: "Academics & Gradebook", icon: <IconAcademics size={16} /> },
    { id: "finance", label: "Finance & Fee Desk", icon: <IconFinance size={16} /> },
    { id: "transport", label: "Live GPS Fleet", icon: <IconTransport size={16} /> },
    { id: "library", label: "Library Catalog", icon: <IconLibrary size={16} /> },
    { id: "staff", label: "Staff & HR Payroll", icon: <IconStaff size={16} /> },
    { id: "notices", label: "Circulars & Notices", icon: <IconNotice size={16} /> },
    { id: "parent", label: "Parent-Teacher Desk", icon: <IconParent size={16} /> },
    { id: "analytics_docs", label: "AI Insights & Document Center", icon: <IconAward size={16} /> }
  ];

  return (
    <div className="erp-dedicated-layout min-vh-100 bg-slate-50 text-dark">
      <div className="container-fluid px-lg-4 py-3">
        {/* Dedicated ERP Top Command Center */}
        <ERPHeader
          activeRole={activeRole}
          setActiveRole={handleRoleChange}
          erpData={erpData}
          onRefresh={refreshState}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Primary ERP Navigation Ribbon */}
        <div className="card border rounded-3 mb-4 bg-white shadow-xs overflow-hidden">
          <div className="d-flex overflow-auto p-1 align-items-center gap-1 erp-tab-bar">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn btn-sm rounded-2 fw-medium text-nowrap px-3 py-2 transition-all d-flex align-items-center gap-2 ${
                    isActive
                      ? "btn-primary shadow-xs"
                      : "btn-light bg-transparent text-secondary border-0"
                  }`}
                  style={{ fontSize: "0.82rem" }}
                >
                  <span className={isActive ? "text-white" : "text-muted"}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Module Content View */}
        {activeTab === "overview" && (
          <ERPDashboardOverview
            erpData={erpData}
            setActiveTab={setActiveTab}
            onOpenAdmission={() => {
              setActiveTab("sis");
              setShowAdmissionModal(true);
            }}
          />
        )}

        {activeTab === "sis" && (
          <ERPSISModule
            erpData={erpData}
            onRefresh={refreshState}
            searchQuery={searchQuery}
            showAdmissionModal={showAdmissionModal}
            setShowAdmissionModal={setShowAdmissionModal}
          />
        )}

        {activeTab === "attendance" && (
          <ERPAttendanceModule erpData={erpData} onRefresh={refreshState} />
        )}

        {activeTab === "academics" && (
          <ERPAcademicsModule erpData={erpData} onRefresh={refreshState} />
        )}

        {activeTab === "finance" && (
          <ERPFinanceModule erpData={erpData} onRefresh={refreshState} />
        )}

        {activeTab === "transport" && (
          <ERPTransportModule erpData={erpData} onRefresh={refreshState} />
        )}

        {activeTab === "library" && (
          <ERPLibraryModule erpData={erpData} onRefresh={refreshState} />
        )}

        {activeTab === "staff" && (
          <ERPStaffModule erpData={erpData} onRefresh={refreshState} />
        )}

        {activeTab === "notices" && (
          <ERPNoticesModule erpData={erpData} onRefresh={refreshState} />
        )}

        {activeTab === "parent" && (
          <ERPParentPortal
            erpData={erpData}
            onRefresh={refreshState}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "analytics_docs" && (
          <ERPAnalyticsAndDocsModule erpData={erpData} />
        )}
      </div>
    </div>
  );
}
