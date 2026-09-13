# Greenwood International Academy - Enterprise School ERP Suite
## Comprehensive System Specifications, Architectural Blueprint & Operational Manual

---

## 1. Executive Summary & Architectural Overview

The **Greenwood International Academy School Enterprise Resource Planning (ERP) Suite** is an institutional-grade, multi-tenant administrative ecosystem built natively within the **EduMind AI** platform. It provides end-to-end digital governance across all academic, logistical, financial, and pedagogical operations of modern educational institutions.

### Core Architectural Pillars
- **Dedicated Institutional Workspace**: Operates in an isolated, edge-to-edge environment (`/erp`), completely distinct from consumer LMS interfaces, featuring an enterprise day-mode design palette (Slate-50, Indigo-900, Emerald-600, crisp vector SVGs, and zero emojis).
- **Multi-Stakeholder Persona Switching**: Provides zero-latency role perspective toggling across seven institutional user classes:
  1. **Principal & Superuser Admin**
  2. **Class Faculty & Mentors**
  3. **Enrolled Students**
  4. **Parents & Legal Guardians**
  5. **Chief Financial Officer & Bursar**
  6. **Resource Librarian**
  7. **Fleet Operations & Transport Captains**
- **Offline-First Deterministic State Engine (`erpStorage.js`)**: All student dossiers, attendance registers, marks records, bursar invoices, library loans, circulars, and audit logs persist deterministically in browser storage with single-click factory re-seeding and JSON snapshot backup/restoration.
- **Regulatory Print Standards (`@media print`)**: Native CSS print stylesheets delivering audit-ready official documents with security seals, crests, and authorized signatory blocks.

---

## 2. Institutional Modules & Technical Specifications

### Module 1: Executive Command Center & Live KPI Dashboard
- **Institutional Health Gauges**:
  - Real-time enrolled student count (1,248 base cohort).
  - Academic staff count across 8 functional departments.
  - Daily biometric campus attendance rate (94.2%).
  - Fiscal fee collection rate (89.4%).
  - Active fleet telemetry (4/4 buses on scheduled routes).
  - Indexed library titles (4,850 cataloged volumes).
- **Direct Operational Launcher**: One-click shortcuts to admit students, mark attendance, collect tuition fees, evaluate marks, inspect vehicle telemetry, and issue circulars.
- **Continuous Audit Stream**: Real-time chronological transaction log capturing student admissions, RFID badge validations, tuition receipts, and circular broadcasts.

---

### Module 2: Student Information System (SIS) & Admissions Wizard
- **Comprehensive Student Dossiers**: Captures demographic, medical (Blood Group), emergency contact, residential address, commute bus stops, and academic cohorts.
- **Multi-Dimensional Query Filtering**: Instant filtering by Grade (Grade 1 through 12), Section (A, B, C), and Fee Payment Standing (Fully Paid, Partial, Unpaid).
- **Interactive Admissions Protocol**:
  - Validates applicant name, guardian identity, contact phone, and date of birth.
  - Automatically calculates and assigns next sequential Roll Number and alphanumeric Student Registration ID (`STU-XXXX`).
  - Instantly initializes bursar account statements, term gradebooks, and turnstile badge permissions.

---

### Module 3: Daily Attendance & Biometric Turnstile Terminal
- **Classroom Roll Call Register**:
  - Section-wise attendance recording with one-click toggles: **Present (P)**, **Absent (A)**, **Late (L)**, and **Excused (E)**.
  - Quick-action shortcuts: "Mark All Present" and "Mark All Absent".
  - Automatic calculation of daily present, late, absent counts and section compliance rate.
- **Campus Gate RFID Terminal Simulator**:
  - Simulates high-frequency optical RFID/NFC card tap at main entrance turnstiles.
  - Generates instant optical scan feedback and updates student status to Present.
  - **Automated Guardian SMS Dispatch Engine**: Simulates immediate automated SMS notification delivery to parents upon turnstile check-in (e.g., *"Greenwood Academy: Smart Gate notification - Your ward Aarav Patel (Roll #101) checked in safely at 08:02 AM."*).

---

### Module 4: Academics, Master Schedule & Term Gradebook
- **Institutional Timetable Schedule Matrix**:
  - Master 5-day period matrix (Monday through Friday, Periods 1 to 6 with scheduled Recess).
  - Displays subject name, faculty instructor, and assigned laboratory/studio room.
- **Interactive Gradebook Marks Editor**:
  - Term switcher (Term 1 Mid-Year Evaluation vs Term 2 Final Assessment).
  - Direct score input for Mathematics, Science, English, Social Studies, and AI & Robotics.
  - Automatic dynamic calculation of Grand Total (out of 500), Aggregate Percentage, Cumulative GPA (4.0 scale), and Letter Grade (A+, A, B+, B, C, F).
- **Official Student Progress Report Card (CBSE/ICSE Format)**:
  - Printable official progress report featuring institutional letterhead, student profile details, subject-wise marks distribution, aggregate standing, cumulative GPA, and authorized signature blocks.

---

### Module 5: Bursar Finance, Fee Counter & GST Invoicing
- **Fiscal Reconciliation Cards**: Invoiced tuition totals, recovered capital, outstanding accounts receivable, and itemized component allocations (Tuition 65%, STEM Labs 20%, Sports 15%).
- **Student Fee Ledger**: Comprehensive view of individual tuition assessments, payments settled, and outstanding liabilities.
- **Interactive Payment Settlement Gateway**:
  - Supports multiple payment channels: UPI (with simulated merchant VPA), Credit/Debit Card, Net Banking, and Counter Cash.
  - Real-time ledger balance deduction and audit trail generation.
- **Official Payment Acknowledgement Receipt**:
  - Print-ready GST receipt with institutional GSTIN (`29AAAEG4481P1Z4`), automated receipt serial numbers, student identifiers, and itemized fee breakdown.

---

### Module 6: Fleet Telemetry & Live Bus GPS Tracker
- **Active Route Fleet Cards**: Vehicle registration numbers, seating capacities, real-time occupancy, driver profiles, and route schedules.
- **Live Moving Telemetry Simulator**:
  - Simulated real-time speedometer telemetry (32 to 46 km/h).
  - Dynamic route progression bar with scheduled waypoint stops.
  - Visual status indicators for completed vs approaching stops.
- **Emergency Protocols**:
  - **Driver SOS Beacon**: Dispatches priority emergency alerts to campus security.
  - **Traffic Delay Advisory**: Simulates instant bulk SMS alerts to all parents along the congested route.

---

### Module 7: Library Information & Circulation Desk
- **Digital Resource Catalog**: Searchable inventory by ISBN, Title, Author, or Academic Category (Computer Science & AI, Physics, Literature, Social History).
- **Circulation Desk Management**:
  - Issue books with automatic 14-day loan duration calculation.
  - Check in books with automatic calculation of overdue late penalties (₹5.00/day).
- **Simulated Barcode Scanner**: Instant title lookup by scanning or entering ISBN numbers.

---

### Module 8: Faculty Directory & HR Payroll Engine
- **Academic Staff Directory**: Departmental classification (Science, Math, Languages, Administration, Fleet), academic qualifications, contact details, and leave balances (Casual, Sick, Earned).
- **Automated Salary Payroll Generator**:
  - Computes Gross Remuneration = Basic Salary + House Rent Allowance (HRA 30%) + Dearness Allowance (DA 20%).
  - Deducts Statutory Levies = Employee Provident Fund (EPF 12%) + Income Tax TDS + Professional Tax.
  - Computes Net Credited Remuneration.
- **Official Employee Monthly Payslip**: Print-ready salary disbursement statement with EPF UAN, bank details, earnings vs deductions grid, and authorized HR signatures.

---

### Module 9: Institutional Circulars & Notice Desk
- **Digital Announcement Board**: Official circulars categorized by urgency (Urgent, High, Medium, Low) and audience (All, Students & Parents, Faculty, Parents Only).
- **Drafting & Authorization Suite**: Modal composer for issuing official bulletins with automated audit timestamps.

---

### Module 10: Parent-Teacher Communication & Leave Desk
- **Ward Telemetry Overview**: Live attendance standing, tuition account status, assigned bus stop, and current rank standing.
- **Two-Way Faculty Communication Channel**: Interactive message thread with Class Mentor (Mrs. Priya Sharma) with simulated instant faculty responses.
- **Student Leave Application Desk**: Submit planned medical or family absence requests with status tracking (Pending, Approved, Rejected).

---

### Module 11: AI Performance Sentinel, Compliance Scorecard & Document Center
- **AI Early Warning Predictive Sentinel**:
  - Continuously synthesizes attendance percentages, examination grades, and bursar payment records to compute individual risk scores.
  - Classifies students into **Academic Scholars**, **Stable**, **Moderate Attention**, and **High Risk Priority**.
  - **One-Click Automated Intervention Prescription**: Generates customized remediation directives (assigned peer tutoring, bi-weekly parent conferences, bursar payment restructuring).
- **Institutional Accreditation Scorecard**:
  - Real-time NEP 2020 & CBSE compliance scoring (**96.8 / 100 - Grade A++**).
  - Monitors teacher-to-student ratio (1:14.5), fleet safety audits (100%), and curriculum digitalization (98.2%).
- **Certificate Issuance Desk**:
  - **Official Bonafide & Character Certificate**: Formal verification for passport, visa, and scholarship applications.
  - **School Transfer Certificate (TC)**: Standard CBSE migration clearance document with conduct records and dues clearance.
  - **Certificate of Academic Merit & Honor**: Commendation certificate for academic excellence.

---

## 3. Printable Documents & Regulatory Conformity

The system implements dedicated print formatting rules (`@media print` in `css/style.css`), ensuring:
- Elimination of all browser navigation bars, modal backdrops, and action buttons during print execution.
- High-contrast black-and-white typographic rendering with crisp borders.
- Preservation of institutional headers, affiliation numbers, and signature authorization blocks.

| Document Title | Standard Template | Primary Use Case |
| :--- | :--- | :--- |
| **Official Progress Report Card** | CBSE / ICSE Term Progress Marksheet | Terminal academic assessment & promotion |
| **Bursar Fee Receipt** | GST Tax Invoice Receipt | Proof of tuition settlement & tax deduction |
| **Employee Monthly Payslip** | Statutory HR Salary Statement | Income proof, banking & provident fund verification |
| **Bonafide & Conduct Certificate** | Institutional Verification Letter | Passport, visa, and national scholarship vetting |
| **School Transfer Certificate (TC)**| Official Board Migration Certificate | Inter-school transfers & secondary admission |
| **Academic Merit Certificate** | Scholastic Excellence Citation | Annual prize day & honor roll archiving |

---

## 4. State Management, Persistence & Backup Protocol

All operational data resides in client storage under `edumind_school_erp_state_v1`:
- **State Export**: Generates a standardized, indented JSON file (`greenwood-academy-erp-YYYY-MM-DD.json`) containing all students, marks, fee ledgers, routes, and staff records.
- **State Import**: Validates JSON schema integrity and restores complete historical states without requiring server restarts.
- **Factory Reset**: Immediately reseeds realistic demo data for testing and demonstrations.

---

## 5. Security, Access Control & Enterprise Governance

1. **Role-Based Access Control (RBAC)**: Each persona view restricts access to relevant functions (e.g. parents cannot edit gradebooks; accountants cannot alter academic marks).
2. **Audit Traceability**: All state mutations (fee collection, marks updates, student admissions, gate swipes) write timestamped records to the live audit stream.
3. **Data Privacy**: Student records, emergency contact numbers, and financial statements are strictly scoped to verified guardian and faculty views.

---

*Authored for Greenwood International Academy Administration & EduMind AI Platform, September 2026.*
