// LocalStorage State Manager for School ERP Simulation

const STORAGE_KEY = "edumind_school_erp_state_v1";

const INITIAL_ERP_DATA = {
  schoolInfo: {
    name: "Greenwood International Academy & AI Lab",
    affiliation: "CBSE / Global STEM Affiliation #2130894",
    established: 2008,
    principal: "Dr. Evelyn Vance, Ph.D.",
    academicYear: "2026 - 2027",
    term: "Term 1 (Mid-Year Evaluation)",
    address: "42 Knowledge Boulevard, Tech Corridor, Bangalore",
    phone: "+91 80 2845 9000",
    email: "admissions@greenwood-academy.edu"
  },
  stats: {
    totalStudents: 1248,
    totalStaff: 86,
    activeBuses: 12,
    libraryBooks: 4850,
    feeCollectionRate: "89.4%",
    todayAttendanceRate: "94.2%"
  },
  students: [
    {
      id: "STU-1001",
      rollNo: 101,
      name: "Aarav Patel",
      gender: "Male",
      grade: "Grade 10",
      section: "A",
      dob: "2010-04-12",
      bloodGroup: "O+",
      parentName: "Rajesh Patel",
      parentPhone: "+91 98765 43210",
      parentEmail: "rajesh.patel@example.com",
      address: "B-402, Sunshine Heights, Bangalore",
      busRoute: "Route 04 - Orange Metro",
      busStop: "Indiranagar 100ft Rd",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      status: "Active",
      attendance: 94,
      fee: {
        total: 85000,
        paid: 85000,
        due: 0,
        status: "Paid",
        lastReceipt: "REC-2026-089",
        lastPaidDate: "2026-07-10"
      },
      marks: {
        term1: {
          Mathematics: 92,
          Science: 88,
          English: 85,
          "Social Studies": 90,
          "AI & Robotics": 98
        },
        term2: {
          Mathematics: 95,
          Science: 91,
          English: 89,
          "Social Studies": 92,
          "AI & Robotics": 100
        }
      }
    },
    {
      id: "STU-1002",
      rollNo: 102,
      name: "Ananya Sharma",
      gender: "Female",
      grade: "Grade 10",
      section: "A",
      dob: "2010-09-21",
      bloodGroup: "B+",
      parentName: "Vikram Sharma",
      parentPhone: "+91 98231 11223",
      parentEmail: "vikram.sharma@example.com",
      address: "Flat 12A, Palm Meadows, Bangalore",
      busRoute: "Route 01 - Blue Line",
      busStop: "Koramangala 4th Block",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      status: "Active",
      attendance: 98,
      fee: {
        total: 85000,
        paid: 60000,
        due: 25000,
        status: "Partial",
        lastReceipt: "REC-2026-042",
        lastPaidDate: "2026-06-15"
      },
      marks: {
        term1: {
          Mathematics: 96,
          Science: 95,
          English: 94,
          "Social Studies": 91,
          "AI & Robotics": 97
        },
        term2: {
          Mathematics: 98,
          Science: 97,
          English: 96,
          "Social Studies": 94,
          "AI & Robotics": 99
        }
      }
    },
    {
      id: "STU-1003",
      rollNo: 103,
      name: "Rohan Kulkarni",
      gender: "Male",
      grade: "Grade 10",
      section: "A",
      dob: "2010-01-18",
      bloodGroup: "A+",
      parentName: "Sanjay Kulkarni",
      parentPhone: "+91 97654 88776",
      parentEmail: "sanjay.kulkarni@example.com",
      address: "Villa 8, Greenwood Estate, Bangalore",
      busRoute: "Route 02 - Green Express",
      busStop: "Whitefield Hope Farm",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      status: "Active",
      attendance: 87,
      fee: {
        total: 85000,
        paid: 85000,
        due: 0,
        status: "Paid",
        lastReceipt: "REC-2026-091",
        lastPaidDate: "2026-07-12"
      },
      marks: {
        term1: {
          Mathematics: 78,
          Science: 82,
          English: 80,
          "Social Studies": 75,
          "AI & Robotics": 88
        },
        term2: {
          Mathematics: 82,
          Science: 85,
          English: 83,
          "Social Studies": 79,
          "AI & Robotics": 91
        }
      }
    },
    {
      id: "STU-1004",
      rollNo: 104,
      name: "Meera Nair",
      gender: "Female",
      grade: "Grade 10",
      section: "B",
      dob: "2010-06-30",
      bloodGroup: "AB+",
      parentName: "Gopalkrishnan Nair",
      parentPhone: "+91 99887 76655",
      parentEmail: "gnair@example.com",
      address: "House 104, HSR Layout Sector 2, Bangalore",
      busRoute: "Route 04 - Orange Metro",
      busStop: "HSR BDA Complex",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      status: "Active",
      attendance: 92,
      fee: {
        total: 85000,
        paid: 40000,
        due: 45000,
        status: "Partial",
        lastReceipt: "REC-2026-031",
        lastPaidDate: "2026-05-20"
      },
      marks: {
        term1: {
          Mathematics: 88,
          Science: 90,
          English: 92,
          "Social Studies": 87,
          "AI & Robotics": 93
        },
        term2: {
          Mathematics: 90,
          Science: 92,
          English: 94,
          "Social Studies": 89,
          "AI & Robotics": 95
        }
      }
    },
    {
      id: "STU-1005",
      rollNo: 105,
      name: "Kabir Sengupta",
      gender: "Male",
      grade: "Grade 9",
      section: "A",
      dob: "2011-03-14",
      bloodGroup: "O-",
      parentName: "Debashis Sengupta",
      parentPhone: "+91 98450 12345",
      parentEmail: "debashis.sen@example.com",
      address: "Apt 501, Lakeview Residency, Bangalore",
      busRoute: "Route 03 - Silver Hills",
      busStop: "Bellandur Gate",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      status: "Active",
      attendance: 91,
      fee: {
        total: 80000,
        paid: 80000,
        due: 0,
        status: "Paid",
        lastReceipt: "REC-2026-104",
        lastPaidDate: "2026-07-28"
      },
      marks: {
        term1: {
          Mathematics: 84,
          Science: 86,
          English: 88,
          "Social Studies": 82,
          "AI & Robotics": 94
        },
        term2: {
          Mathematics: 87,
          Science: 89,
          English: 90,
          "Social Studies": 85,
          "AI & Robotics": 96
        }
      }
    },
    {
      id: "STU-1006",
      rollNo: 106,
      name: "Diya Iyer",
      gender: "Female",
      grade: "Grade 9",
      section: "B",
      dob: "2011-08-05",
      bloodGroup: "A-",
      parentName: "Raman Iyer",
      parentPhone: "+91 97123 45678",
      parentEmail: "raman.iyer@example.com",
      address: "Plot 33, Electronic City Phase 1, Bangalore",
      busRoute: "Route 01 - Blue Line",
      busStop: "Silk Board Flyover",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      status: "Active",
      attendance: 96,
      fee: {
        total: 80000,
        paid: 20000,
        due: 60000,
        status: "Pending",
        lastReceipt: "REC-2026-012",
        lastPaidDate: "2026-04-10"
      },
      marks: {
        term1: {
          Mathematics: 91,
          Science: 93,
          English: 90,
          "Social Studies": 88,
          "AI & Robotics": 95
        },
        term2: {
          Mathematics: 94,
          Science: 95,
          English: 92,
          "Social Studies": 90,
          "AI & Robotics": 97
        }
      }
    },
    {
      id: "STU-1007",
      rollNo: 107,
      name: "Tanya Kapoor",
      gender: "Female",
      grade: "Grade 11",
      section: "A",
      dob: "2009-11-19",
      bloodGroup: "B-",
      parentName: "Harsh Kapoor",
      parentPhone: "+91 98334 55667",
      parentEmail: "hkapoor@example.com",
      address: "Skyline Towers 14B, MG Road, Bangalore",
      busRoute: "Route 02 - Green Express",
      busStop: "Trinity Circle",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      status: "Active",
      attendance: 95,
      fee: {
        total: 92000,
        paid: 92000,
        due: 0,
        status: "Paid",
        lastReceipt: "REC-2026-118",
        lastPaidDate: "2026-08-02"
      },
      marks: {
        term1: {
          Mathematics: 94,
          Science: 96,
          English: 89,
          "Social Studies": 91,
          "AI & Robotics": 98
        },
        term2: {
          Mathematics: 97,
          Science: 98,
          English: 92,
          "Social Studies": 93,
          "AI & Robotics": 100
        }
      }
    },
    {
      id: "STU-1008",
      rollNo: 108,
      name: "Zaid Khan",
      gender: "Male",
      grade: "Grade 12",
      section: "A",
      dob: "2008-05-14",
      bloodGroup: "O+",
      parentName: "Imran Khan",
      parentPhone: "+91 99001 22334",
      parentEmail: "imran.khan@example.com",
      address: "Heritage Greens 203, Sarjapur Rd, Bangalore",
      busRoute: "Route 03 - Silver Hills",
      busStop: "Sarjapur Fire Station",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      status: "Active",
      attendance: 88,
      fee: {
        total: 98000,
        paid: 50000,
        due: 48000,
        status: "Partial",
        lastReceipt: "REC-2026-065",
        lastPaidDate: "2026-06-30"
      },
      marks: {
        term1: {
          Mathematics: 89,
          Science: 91,
          English: 85,
          "Social Studies": 87,
          "AI & Robotics": 95
        },
        term2: {
          Mathematics: 91,
          Science: 93,
          English: 88,
          "Social Studies": 89,
          "AI & Robotics": 97
        }
      }
    }
  ],
  staff: [
    {
      id: "STF-201",
      name: "Mrs. Priya Sharma",
      designation: "Head of Science & Grade 10-A Class Mentor",
      department: "Science & Technology",
      qualification: "M.Sc. Physics, B.Ed. (Gold Medalist)",
      email: "priya.sharma@greenwood-academy.edu",
      phone: "+91 98451 77665",
      joiningDate: "2018-06-01",
      leaveBalance: { casual: 8, sick: 10, earned: 14 },
      salary: { basic: 62000, hra: 18600, da: 12400, pf: 7440, tax: 4500, net: 81060 },
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-202",
      name: "Mr. Arjun Menon",
      designation: "Senior Mathematics Faculty",
      department: "Mathematics",
      qualification: "M.Sc. Applied Mathematics",
      email: "arjun.menon@greenwood-academy.edu",
      phone: "+91 98452 88776",
      joiningDate: "2019-07-15",
      leaveBalance: { casual: 6, sick: 12, earned: 15 },
      salary: { basic: 58000, hra: 17400, da: 11600, pf: 6960, tax: 4200, net: 75840 },
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-203",
      name: "Dr. K. R. Nambiar",
      designation: "Lead AI & Computer Science Instructor",
      department: "Computer Science",
      qualification: "Ph.D. in Computer Science & Robotics",
      email: "kr.nambiar@greenwood-academy.edu",
      phone: "+91 98453 99887",
      joiningDate: "2020-01-10",
      leaveBalance: { casual: 10, sick: 10, earned: 18 },
      salary: { basic: 70000, hra: 21000, da: 14000, pf: 8400, tax: 6000, net: 90600 },
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-204",
      name: "Ms. Shalini Gupta",
      designation: "Senior English & Literature Faculty",
      department: "Languages",
      qualification: "M.A. English, M.Phil.",
      email: "shalini.gupta@greenwood-academy.edu",
      phone: "+91 98454 00112",
      joiningDate: "2021-03-01",
      leaveBalance: { casual: 9, sick: 9, earned: 12 },
      salary: { basic: 54000, hra: 16200, da: 10800, pf: 6480, tax: 3800, net: 70720 },
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-205",
      name: "Mr. Vinod Deshmukh",
      designation: "Chief Financial Officer & Bursar",
      department: "Administration & Accounts",
      qualification: "Chartered Accountant (FCA), B.Com",
      email: "accounts@greenwood-academy.edu",
      phone: "+91 98455 11223",
      joiningDate: "2016-11-01",
      leaveBalance: { casual: 7, sick: 11, earned: 20 },
      salary: { basic: 75000, hra: 22500, da: 15000, pf: 9000, tax: 7000, net: 96500 },
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-206",
      name: "Mrs. Leela Thomas",
      designation: "Head Librarian & Knowledge Resource Head",
      department: "Library & Information",
      qualification: "M.Lib.Sc, UGC-NET Qualified",
      email: "library@greenwood-academy.edu",
      phone: "+91 98456 22334",
      joiningDate: "2017-08-16",
      leaveBalance: { casual: 11, sick: 12, earned: 16 },
      salary: { basic: 52000, hra: 15600, da: 10400, pf: 6240, tax: 3500, net: 68260 },
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-207",
      name: "Mr. Balram Singh",
      designation: "Transport & Logistics Supervisor",
      department: "Fleet Operations",
      qualification: "Dip. Automobile Engineering, Safety Certified",
      email: "transport@greenwood-academy.edu",
      phone: "+91 98457 33445",
      joiningDate: "2019-02-10",
      leaveBalance: { casual: 8, sick: 14, earned: 15 },
      salary: { basic: 46000, hra: 13800, da: 9200, pf: 5520, tax: 2800, net: 60680 },
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  ],
  timetable: {
    "Grade 10-A": [
      {
        day: "Monday",
        periods: [
          { time: "08:30 - 09:15", subject: "Mathematics", teacher: "Mr. Menon", room: "Lab 2" },
          { time: "09:20 - 10:05", subject: "Physics", teacher: "Mrs. Sharma", room: "Phy Lab" },
          { time: "10:10 - 10:55", subject: "English Lit", teacher: "Ms. Gupta", room: "Room 101" },
          { time: "11:00 - 11:30", subject: "Break", teacher: "Cafeteria", room: "Snacks" },
          { time: "11:35 - 12:20", subject: "AI & Robotics", teacher: "Dr. Nambiar", room: "AI Innovation Lab" },
          { time: "12:25 - 01:10", subject: "Social Studies", teacher: "Mr. Verma", room: "Room 101" },
          { time: "01:15 - 02:00", subject: "Physical Ed", teacher: "Coach Roy", room: "Sports Ground" }
        ]
      },
      {
        day: "Tuesday",
        periods: [
          { time: "08:30 - 09:15", subject: "Chemistry", teacher: "Dr. Roy", room: "Chem Lab" },
          { time: "09:20 - 10:05", subject: "Mathematics", teacher: "Mr. Menon", room: "Lab 2" },
          { time: "10:10 - 10:55", subject: "AI & Robotics", teacher: "Dr. Nambiar", room: "AI Innovation Lab" },
          { time: "11:00 - 11:30", subject: "Break", teacher: "Cafeteria", room: "Snacks" },
          { time: "11:35 - 12:20", subject: "English Lit", teacher: "Ms. Gupta", room: "Room 101" },
          { time: "12:25 - 01:10", subject: "Biology", teacher: "Mrs. Sharma", room: "Bio Lab" },
          { time: "01:15 - 02:00", subject: "Library Hour", teacher: "Mrs. Thomas", room: "Central Library" }
        ]
      },
      {
        day: "Wednesday",
        periods: [
          { time: "08:30 - 09:15", subject: "Physics", teacher: "Mrs. Sharma", room: "Phy Lab" },
          { time: "09:20 - 10:05", subject: "Mathematics", teacher: "Mr. Menon", room: "Lab 2" },
          { time: "10:10 - 10:55", subject: "Social Studies", teacher: "Mr. Verma", room: "Room 101" },
          { time: "11:00 - 11:30", subject: "Break", teacher: "Cafeteria", room: "Snacks" },
          { time: "11:35 - 12:20", subject: "AI Hands-On", teacher: "Dr. Nambiar", room: "Robotics Arena" },
          { time: "12:25 - 01:10", subject: "Environmental Sc", teacher: "Mrs. Sharma", room: "Room 101" },
          { time: "01:15 - 02:00", subject: "Art & Music", teacher: "Ms. Das", room: "Studio 3" }
        ]
      },
      {
        day: "Thursday",
        periods: [
          { time: "08:30 - 09:15", subject: "Mathematics", teacher: "Mr. Menon", room: "Lab 2" },
          { time: "09:20 - 10:05", subject: "Chemistry", teacher: "Dr. Roy", room: "Chem Lab" },
          { time: "10:10 - 10:55", subject: "English Lit", teacher: "Ms. Gupta", room: "Room 101" },
          { time: "11:00 - 11:30", subject: "Break", teacher: "Cafeteria", room: "Snacks" },
          { time: "11:35 - 12:20", subject: "Social Studies", teacher: "Mr. Verma", room: "Room 101" },
          { time: "12:25 - 01:10", subject: "Physics Lab", teacher: "Mrs. Sharma", room: "Phy Lab" },
          { time: "01:15 - 02:00", subject: "Debate & Speech", teacher: "Ms. Gupta", room: "Auditorium" }
        ]
      },
      {
        day: "Friday",
        periods: [
          { time: "08:30 - 09:15", subject: "AI & Data Ethics", teacher: "Dr. Nambiar", room: "AI Innovation Lab" },
          { time: "09:20 - 10:05", subject: "Biology", teacher: "Mrs. Sharma", room: "Bio Lab" },
          { time: "10:10 - 10:55", subject: "Mathematics Quiz", teacher: "Mr. Menon", room: "Lab 2" },
          { time: "11:00 - 11:30", subject: "Break", teacher: "Cafeteria", room: "Snacks" },
          { time: "11:35 - 12:20", subject: "World History", teacher: "Mr. Verma", room: "Room 101" },
          { time: "12:25 - 01:10", subject: "English Writing", teacher: "Ms. Gupta", room: "Room 101" },
          { time: "01:15 - 02:00", subject: "Club & Activities", teacher: "Various", room: "Activity Center" }
        ]
      }
    ]
  },
  dailyAttendance: {
    "Grade 10-A": {
      date: new Date().toISOString().split("T")[0],
      records: {
        "STU-1001": "Present",
        "STU-1002": "Present",
        "STU-1003": "Present",
        "STU-1004": "Late"
      }
    }
  },
  transportRoutes: [
    {
      id: "BUS-01",
      name: "Route 01 - Blue Line (Koramangala / HSR)",
      busNumber: "KA 01 EK 4488",
      capacity: 45,
      occupancy: 38,
      driverName: "Rameshwar Gowda",
      driverPhone: "+91 98450 44881",
      currentSpeed: 38,
      currentStopIndex: 2,
      status: "In Transit",
      stops: [
        { name: "Electronic City Phase 1", time: "07:15 AM", passed: true },
        { name: "Silk Board Junction", time: "07:35 AM", passed: true },
        { name: "Koramangala 4th Block", time: "07:55 AM", passed: true },
        { name: "Sony World Signal", time: "08:10 AM", passed: false },
        { name: "Greenwood Campus Gate 1", time: "08:25 AM", passed: false }
      ]
    },
    {
      id: "BUS-02",
      name: "Route 02 - Green Express (Whitefield / ITPL)",
      busNumber: "KA 03 MG 7721",
      capacity: 45,
      occupancy: 42,
      driverName: "Santosh Pujari",
      driverPhone: "+91 98450 77212",
      currentSpeed: 42,
      currentStopIndex: 1,
      status: "In Transit",
      stops: [
        { name: "ITPL Main Gate", time: "07:20 AM", passed: true },
        { name: "Hope Farm Circle", time: "07:38 AM", passed: true },
        { name: "Kundalahalli Gate", time: "07:55 AM", passed: false },
        { name: "Marathahalli Bridge", time: "08:12 AM", passed: false },
        { name: "Greenwood Campus Gate 2", time: "08:25 AM", passed: false }
      ]
    },
    {
      id: "BUS-03",
      name: "Route 03 - Silver Hills (Sarjapur / Bellandur)",
      busNumber: "KA 51 AB 1099",
      capacity: 40,
      occupancy: 35,
      driverName: "Dharmesh Yadav",
      driverPhone: "+91 98450 10993",
      currentSpeed: 32,
      currentStopIndex: 2,
      status: "In Transit",
      stops: [
        { name: "Sarjapur Fire Station", time: "07:10 AM", passed: true },
        { name: "Carmelaram Station", time: "07:30 AM", passed: true },
        { name: "Bellandur Gate", time: "07:50 AM", passed: true },
        { name: "Iblur Junction", time: "08:05 AM", passed: false },
        { name: "Greenwood Campus Gate 1", time: "08:25 AM", passed: false }
      ]
    },
    {
      id: "BUS-04",
      name: "Route 04 - Orange Metro (Indiranagar / MG Rd)",
      busNumber: "KA 04 CD 9920",
      capacity: 42,
      occupancy: 39,
      driverName: "Mohd. Shakir",
      driverPhone: "+91 98450 99204",
      currentSpeed: 35,
      currentStopIndex: 3,
      status: "Approaching School",
      stops: [
        { name: "Trinity Circle MG Road", time: "07:25 AM", passed: true },
        { name: "Indiranagar 100ft Rd", time: "07:45 AM", passed: true },
        { name: "Domlur Flyover", time: "08:00 AM", passed: true },
        { name: "Manipal Hospital Stop", time: "08:15 AM", passed: true },
        { name: "Greenwood Campus Gate 1", time: "08:25 AM", passed: false }
      ]
    }
  ],
  libraryBooks: [
    {
      id: "BK-101",
      isbn: "978-0134685991",
      title: "Artificial Intelligence: A Modern Approach",
      author: "Stuart Russell & Peter Norvig",
      category: "Computer Science & AI",
      rack: "Rack A-04",
      totalCopies: 8,
      availableCopies: 5,
      issuedTo: [
        { studentId: "STU-1001", studentName: "Aarav Patel", issueDate: "2026-08-20", dueDate: "2026-09-05" },
        { studentId: "STU-1007", studentName: "Tanya Kapoor", issueDate: "2026-08-25", dueDate: "2026-09-10" }
      ]
    },
    {
      id: "BK-102",
      isbn: "978-0199535569",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Classic Literature",
      rack: "Rack L-12",
      totalCopies: 12,
      availableCopies: 10,
      issuedTo: [
        { studentId: "STU-1002", studentName: "Ananya Sharma", issueDate: "2026-08-28", dueDate: "2026-09-12" }
      ]
    },
    {
      id: "BK-103",
      isbn: "978-0486600888",
      title: "Principles of Quantum Mechanics",
      author: "P.A.M. Dirac",
      category: "Physics",
      rack: "Rack P-02",
      totalCopies: 6,
      availableCopies: 4,
      issuedTo: [
        { studentId: "STU-1003", studentName: "Rohan Kulkarni", issueDate: "2026-08-15", dueDate: "2026-08-30" } // Overdue
      ]
    },
    {
      id: "BK-104",
      isbn: "978-0321573513",
      title: "Algorithms (4th Edition)",
      author: "Robert Sedgewick & Kevin Wayne",
      category: "Computer Science",
      rack: "Rack A-02",
      totalCopies: 10,
      availableCopies: 7,
      issuedTo: []
    },
    {
      id: "BK-105",
      isbn: "978-0062316097",
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      category: "Social History",
      rack: "Rack H-08",
      totalCopies: 15,
      availableCopies: 12,
      issuedTo: []
    }
  ],
  notices: [
    {
      id: "NOT-301",
      title: "Annual Science & AI Robotics Expo 2026 Registrations Open",
      category: "Academic & Tech",
      priority: "High",
      targetAudience: "All",
      date: "2026-09-10",
      content: "All students from Grades 6 to 12 are invited to present innovative working prototypes at the annual STEM & AI Exhibition scheduled for October 15th, 2026. Industry mentors from IISc and top tech labs will judge entries.",
      author: "Dr. Evelyn Vance, Principal"
    },
    {
      id: "NOT-302",
      title: "Term 1 Mid-Term Examination Schedule & Hall Ticket Guidelines",
      category: "Exams",
      priority: "Urgent",
      targetAudience: "Students & Parents",
      date: "2026-09-08",
      content: "Term 1 written exams will commence from September 22nd. Digital hall tickets must be downloaded and verified by parents before Sept 18. Strict adherence to exam hall rules is required.",
      author: "Examination Cell"
    },
    {
      id: "NOT-303",
      title: "Transport Route 02 Timetable Adjustment for Road Works",
      category: "Transport",
      priority: "Medium",
      targetAudience: "Parents",
      date: "2026-09-05",
      content: "Due to stormwater drain construction near Kundalahalli Gate, Bus 02 will depart 10 minutes earlier starting Monday. Parents are requested to ensure students are at stops on time.",
      author: "Transport Supervisor"
    },
    {
      id: "NOT-304",
      title: "Parent-Teacher Conference (PTC) - Slot Booking Portal Live",
      category: "General",
      priority: "High",
      targetAudience: "Parents",
      date: "2026-09-01",
      content: "PTC for Mid-Term 1 will be held on Saturday, Sept 28th. Parents can select convenient 15-minute slots with Class Mentors via the Parent Portal.",
      author: "Academic Office"
    }
  ],
  leaveRequests: [
    {
      id: "LEV-501",
      applicantType: "Student",
      applicantId: "STU-1003",
      applicantName: "Rohan Kulkarni",
      grade: "Grade 10-A",
      fromDate: "2026-09-18",
      toDate: "2026-09-19",
      reason: "Family function & ancestral ceremony in Mysore",
      status: "Approved",
      reviewedBy: "Mrs. Priya Sharma (Mentor)"
    },
    {
      id: "LEV-502",
      applicantType: "Student",
      applicantId: "STU-1004",
      applicantName: "Meera Nair",
      grade: "Grade 10-B",
      fromDate: "2026-09-25",
      toDate: "2026-09-26",
      reason: "State Level Classical Dance Competition",
      status: "Pending",
      reviewedBy: "Under Review"
    },
    {
      id: "LEV-503",
      applicantType: "Staff",
      applicantId: "STF-202",
      applicantName: "Mr. Arjun Menon",
      grade: "Mathematics",
      fromDate: "2026-09-15",
      toDate: "2026-09-16",
      reason: "National Mathematics Pedagogy Conference at Chennai",
      status: "Approved",
      reviewedBy: "Dr. Evelyn Vance (Principal)"
    }
  ],
  auditLogs: [
    { id: "LOG-01", timestamp: "08:12 AM", message: "Automated RFID Gate sync: 1,180 students logged into campus." },
    { id: "LOG-02", timestamp: "08:25 AM", message: "Fleet Dispatch: All 4 major bus routes reached perimeter on time." },
    { id: "LOG-03", timestamp: "09:05 AM", message: "Fee Payment: ₹85,000 received for Aarav Patel (REC-2026-089)." },
    { id: "LOG-04", timestamp: "09:30 AM", message: "Notice circular #NOT-301 broadcast to 1,248 student portals." }
  ],
  simulatedSmsQueue: [
    {
      id: "SMS-101",
      to: "+91 98765 43210 (Rajesh Patel)",
      time: "08:02 AM",
      text: "Greenwood Academy: Your ward Aarav Patel (Roll #101) checked in safely at Campus Gate A at 08:02 AM."
    },
    {
      id: "SMS-102",
      to: "+91 98231 11223 (Vikram Sharma)",
      time: "08:04 AM",
      text: "Greenwood Academy: Your ward Ananya Sharma (Roll #102) checked in safely at Campus Gate A at 08:04 AM."
    }
  ]
};

// Retrieve State
export function getERPState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load ERP state from localStorage", e);
  }
  // Initialize and persist default
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ERP_DATA));
  return INITIAL_ERP_DATA;
}

// Save State
export function saveERPState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save ERP state", e);
  }
}

// Reset State to Factory Demo
export function resetERPState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ERP_DATA));
  return INITIAL_ERP_DATA;
}

// Export State JSON
export function exportERPState() {
  return JSON.stringify(getERPState(), null, 2);
}

// Import State JSON
export function importERPState(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && parsed.students && parsed.schoolInfo) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return { success: true, state: parsed };
    }
    return { success: false, error: "Invalid ERP backup format." };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Helper: Add Student
export function admitNewStudent(studentData) {
  const state = getERPState();
  const nextRoll = (state.students.length > 0 ? Math.max(...state.students.map((s) => s.rollNo || 100)) : 100) + 1;
  const newStudent = {
    id: `STU-${Date.now().toString().slice(-4)}`,
    rollNo: nextRoll,
    name: studentData.name || "New Student",
    gender: studentData.gender || "Other",
    grade: studentData.grade || "Grade 10",
    section: studentData.section || "A",
    dob: studentData.dob || "2010-01-01",
    bloodGroup: studentData.bloodGroup || "O+",
    parentName: studentData.parentName || "Guardian",
    parentPhone: studentData.parentPhone || "+91 90000 00000",
    parentEmail: studentData.parentEmail || "parent@example.com",
    address: studentData.address || "Bangalore",
    busRoute: studentData.busRoute || "Self Commute",
    busStop: studentData.busStop || "N/A",
    avatar: studentData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    status: "Active",
    attendance: 100,
    fee: {
      total: 85000,
      paid: Number(studentData.initialFeePaid || 0),
      due: 85000 - Number(studentData.initialFeePaid || 0),
      status: Number(studentData.initialFeePaid || 0) >= 85000 ? "Paid" : Number(studentData.initialFeePaid || 0) > 0 ? "Partial" : "Pending",
      lastReceipt: `REC-${Date.now().toString().slice(-5)}`,
      lastPaidDate: new Date().toISOString().split("T")[0]
    },
    marks: {
      term1: { Mathematics: 85, Science: 85, English: 85, "Social Studies": 85, "AI & Robotics": 85 },
      term2: { Mathematics: 88, Science: 88, English: 88, "Social Studies": 88, "AI & Robotics": 88 }
    }
  };

  state.students.unshift(newStudent);
  state.stats.totalStudents += 1;
  state.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    message: `New Admission: ${newStudent.name} admitted to ${newStudent.grade}-${newStudent.section} (Roll #${newStudent.rollNo}).`
  });
  saveERPState(state);
  return { success: true, student: newStudent, state };
}

// Helper: Pay Student Fee
export function payStudentFee(studentId, amount, paymentMode = "UPI") {
  const state = getERPState();
  const student = state.students.find((s) => s.id === studentId);
  if (!student) return { success: false, error: "Student not found" };

  const payAmt = Math.min(Number(amount), student.fee.due);
  student.fee.paid += payAmt;
  student.fee.due -= payAmt;
  student.fee.status = student.fee.due === 0 ? "Paid" : "Partial";
  const receiptId = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;
  student.fee.lastReceipt = receiptId;
  student.fee.lastPaidDate = new Date().toISOString().split("T")[0];

  const logEntry = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    message: `Fee Payment: ₹${payAmt.toLocaleString()} received for ${student.name} via ${paymentMode} (${receiptId}).`
  };
  state.auditLogs.unshift(logEntry);

  saveERPState(state);
  return { success: true, receiptId, student, amountPaid: payAmt, state };
}

// Helper: Toggle Attendance
export function recordAttendance(className, studentId, status) {
  const state = getERPState();
  if (!state.dailyAttendance[className]) {
    state.dailyAttendance[className] = {
      date: new Date().toISOString().split("T")[0],
      records: {}
    };
  }
  state.dailyAttendance[className].records[studentId] = status;
  saveERPState(state);
  return state;
}

// Helper: Mark All Attendance
export function markAllAttendance(className, status = "Present") {
  const state = getERPState();
  if (!state.dailyAttendance[className]) {
    state.dailyAttendance[className] = {
      date: new Date().toISOString().split("T")[0],
      records: {}
    };
  }
  state.students.forEach((s) => {
    state.dailyAttendance[className].records[s.id] = status;
  });
  saveERPState(state);
  return state;
}

// Helper: Simulate RFID Gate Card Tap
export function simulateGateTap(studentId) {
  const state = getERPState();
  const student = state.students.find((s) => s.id === studentId);
  if (!student) return { success: false };

  const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const smsEntry = {
    id: `SMS-${Date.now()}`,
    to: `${student.parentPhone} (${student.parentName})`,
    time: timeStr,
    text: `Greenwood Academy: Smart Gate notification - Your ward ${student.name} (Roll #${student.rollNo}) tapped RFID card at Main Gate at ${timeStr}.`
  };
  state.simulatedSmsQueue.unshift(smsEntry);

  const logEntry = {
    id: `LOG-${Date.now()}`,
    timestamp: timeStr,
    message: `RFID Gate Entry: ${student.name} (${student.grade}-${student.section}) badge authenticated.`
  };
  state.auditLogs.unshift(logEntry);

  saveERPState(state);
  return { success: true, student, sms: smsEntry, timeStr, state };
}

// Helper: Issue Library Book
export function issueBookToStudent(bookId, studentId) {
  const state = getERPState();
  const book = state.libraryBooks.find((b) => b.id === bookId);
  const student = state.students.find((s) => s.id === studentId);
  if (!book || !student) return { success: false, error: "Book or Student not found" };
  if (book.availableCopies <= 0) return { success: false, error: "No copies currently available." };

  const today = new Date();
  const due = new Date();
  due.setDate(today.getDate() + 14);

  book.availableCopies -= 1;
  book.issuedTo.push({
    studentId: student.id,
    studentName: student.name,
    issueDate: today.toISOString().split("T")[0],
    dueDate: due.toISOString().split("T")[0]
  });

  state.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    message: `Library Checkout: "${book.title}" issued to ${student.name} (Due: ${due.toLocaleDateString()}).`
  });

  saveERPState(state);
  return { success: true, state };
}

// Helper: Return Library Book
export function returnBookFromStudent(bookId, studentId) {
  const state = getERPState();
  const book = state.libraryBooks.find((b) => b.id === bookId);
  if (!book) return { success: false, error: "Book not found" };

  const idx = book.issuedTo.findIndex((item) => item.studentId === studentId);
  if (idx === -1) return { success: false, error: "Issue record not found" };

  book.issuedTo.splice(idx, 1);
  book.availableCopies += 1;

  state.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    message: `Library Checkin: "${book.title}" returned to shelf ${book.rack}.`
  });

  saveERPState(state);
  return { success: true, state };
}

// Helper: Update Grade Marks
export function updateStudentMarks(studentId, term, subject, score) {
  const state = getERPState();
  const student = state.students.find((s) => s.id === studentId);
  if (!student) return { success: false };
  if (!student.marks[term]) student.marks[term] = {};
  student.marks[term][subject] = Number(score);
  saveERPState(state);
  return { success: true, state };
}

// Helper: Publish Circular
export function publishNotice(noticeData) {
  const state = getERPState();
  const newNotice = {
    id: `NOT-${Date.now().toString().slice(-4)}`,
    title: noticeData.title || "School Circular",
    category: noticeData.category || "General",
    priority: noticeData.priority || "Medium",
    targetAudience: noticeData.targetAudience || "All",
    date: new Date().toISOString().split("T")[0],
    content: noticeData.content || "",
    author: noticeData.author || "Principal's Desk"
  };
  state.notices.unshift(newNotice);
  state.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    message: `Notice Published: "${newNotice.title}" by ${newNotice.author}.`
  });
  saveERPState(state);
  return { success: true, notice: newNotice, state };
}

// Helper: Submit Leave Request
export function submitLeaveRequest(data) {
  const state = getERPState();
  const newLeave = {
    id: `LEV-${Date.now().toString().slice(-4)}`,
    applicantType: data.applicantType || "Student",
    applicantId: data.applicantId || "STU-1001",
    applicantName: data.applicantName || "Student",
    grade: data.grade || "Grade 10-A",
    fromDate: data.fromDate || new Date().toISOString().split("T")[0],
    toDate: data.toDate || new Date().toISOString().split("T")[0],
    reason: data.reason || "Personal work",
    status: "Pending",
    reviewedBy: "Under Review"
  };
  state.leaveRequests.unshift(newLeave);
  state.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    message: `Leave Application: Submitted by ${newLeave.applicantName} (${newLeave.fromDate} to ${newLeave.toDate}).`
  });
  saveERPState(state);
  return { success: true, leave: newLeave, state };
}

// Helper: Review Leave Request
export function reviewLeaveRequest(leaveId, status, reviewer = "Admin") {
  const state = getERPState();
  const leave = state.leaveRequests.find((l) => l.id === leaveId);
  if (!leave) return { success: false };
  leave.status = status;
  leave.reviewedBy = `${reviewer} (${new Date().toLocaleDateString()})`;
  saveERPState(state);
  return { success: true, state };
}
