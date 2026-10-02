const { sequelize } = require('../config/db');
const {
  User,
  Employee,
  Department,
  Designation,
  Project,
  Task,
  TaskComment,
  LeaveRequest,
  LeaveBalance,
  Attendance,
  Timesheet,
  Payroll,
  Notification,
  Announcement,
  Candidate,
  Onboarding,
  ExpenseClaim,
  AuditLog,
  CompanySettings,
} = require('../models');
const { hashPassword } = require('../utils/password');

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected for seeding.');
    await sequelize.sync({ force: true });
    console.log('Database tables cleared and recreated.');

    // 1. Company Settings
    await CompanySettings.create({
      companyName: 'Aventrix Enterprise HRMS',
      companyEmail: 'contact@aventrix.io',
      companyPhone: '+1 (415) 890-2300',
      address: '500 Howard Street, Suite 1200',
      city: 'San Francisco',
      country: 'United States',
      currency: 'USD',
      currencySymbol: '$',
      dailyWorkingHours: 8.0,
      lateGracePeriodMinutes: 15,
      casualLeaveQuota: 12,
      sickLeaveQuota: 10,
      paidLeaveQuota: 15,
      earnedLeaveQuota: 8,
      holidays: [
        { name: "New Year's Day", date: '2026-01-01' },
        { name: 'President’s Day', date: '2026-02-16' },
        { name: 'Memorial Day', date: '2026-05-25' },
        { name: 'Independence Day', date: '2026-07-04' },
        { name: 'Labor Day', date: '2026-09-07' },
        { name: 'Thanksgiving Day', date: '2026-11-26' },
        { name: 'Christmas Day', date: '2026-12-25' },
      ],
    });

    // 2. Users (Admin, HR, Manager, Employee)
    const adminPassword = await hashPassword('Admin@123456');
    const hrPassword = await hashPassword('Hr@123456');
    const managerPassword = await hashPassword('Manager@123456');
    const employeePassword = await hashPassword('Employee@123456');

    const adminUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'admin@aventrix.com',
      password: adminPassword,
      phone: '+1 (415) 555-0101',
      role: 'admin',
      isActive: true,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    });

    const hrUser = await User.create({
      name: 'Marcus Vance',
      email: 'hr@aventrix.com',
      password: hrPassword,
      phone: '+1 (415) 555-0102',
      role: 'hr',
      isActive: true,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });

    const managerUser = await User.create({
      name: 'Alex Mercer',
      email: 'manager@aventrix.com',
      password: managerPassword,
      phone: '+1 (415) 555-0103',
      role: 'manager',
      isActive: true,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    });

    const employeeUser = await User.create({
      name: 'Elena Rostova',
      email: 'employee@aventrix.com',
      password: employeePassword,
      phone: '+1 (415) 555-0104',
      role: 'employee',
      isActive: true,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    // 3. Departments
    const deptEngineering = await Department.create({
      name: 'Engineering',
      code: 'ENG',
      description: 'Software development, cloud infrastructure, and QA engineering.',
      managerId: managerUser.id,
      isActive: true,
    });

    const deptProduct = await Department.create({
      name: 'Product Design',
      code: 'DES',
      description: 'UI/UX design, user research, and product strategy.',
      managerId: managerUser.id,
      isActive: true,
    });

    const deptHR = await Department.create({
      name: 'Human Resources',
      code: 'HR',
      description: 'Talent acquisition, employee engagement, payroll, and compliance.',
      managerId: hrUser.id,
      isActive: true,
    });

    const deptSales = await Department.create({
      name: 'Sales & Marketing',
      code: 'MKT',
      description: 'Enterprise sales, demand generation, and brand marketing.',
      managerId: adminUser.id,
      isActive: true,
    });

    const deptFinance = await Department.create({
      name: 'Finance & Accounting',
      code: 'FIN',
      description: 'Financial planning, accounting, tax, and budget analysis.',
      managerId: adminUser.id,
      isActive: true,
    });

    // 4. Designations
    await Designation.bulkCreate([
      { title: 'Senior Full Stack Engineer', departmentId: deptEngineering.id, departmentName: 'Engineering' },
      { title: 'Frontend Specialist (Angular)', departmentId: deptEngineering.id, departmentName: 'Engineering' },
      { title: 'Backend Architect (Node.js)', departmentId: deptEngineering.id, departmentName: 'Engineering' },
      { title: 'DevOps & Cloud Engineer', departmentId: deptEngineering.id, departmentName: 'Engineering' },
      { title: 'Lead Product Designer', departmentId: deptProduct.id, departmentName: 'Product Design' },
      { title: 'UI/UX Designer', departmentId: deptProduct.id, departmentName: 'Product Design' },
      { title: 'Senior HR Business Partner', departmentId: deptHR.id, departmentName: 'Human Resources' },
      { title: 'Talent Acquisition Specialist', departmentId: deptHR.id, departmentName: 'Human Resources' },
      { title: 'Enterprise Account Executive', departmentId: deptSales.id, departmentName: 'Sales & Marketing' },
      { title: 'Financial Analyst', departmentId: deptFinance.id, departmentName: 'Finance & Accounting' },
    ]);

    // 5. Employees
    const emp1 = await Employee.create({
      employeeId: 'AVX-1001',
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'employee@aventrix.com',
      phone: '+1 (415) 555-0104',
      dateOfBirth: '1994-06-15',
      gender: 'female',
      department: 'Engineering',
      designation: 'Frontend Specialist (Angular)',
      joiningDate: '2023-01-15',
      employmentType: 'full_time',
      salary: 95000.0,
      address: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94107',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      managerId: managerUser.id,
      status: 'active',
      skills: ['Angular', 'TypeScript', 'SCSS', 'RxJS', 'REST APIs'],
      emergencyContact: 'Dmitri Rostova (+1 415-555-0999 - Brother)',
    });

    const emp2 = await Employee.create({
      employeeId: 'AVX-1002',
      firstName: 'Alex',
      lastName: 'Mercer',
      email: 'manager@aventrix.com',
      phone: '+1 (415) 555-0103',
      dateOfBirth: '1988-11-20',
      gender: 'male',
      department: 'Engineering',
      designation: 'Engineering Manager',
      joiningDate: '2021-03-01',
      employmentType: 'full_time',
      salary: 145000.0,
      address: '1200 Market St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94102',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      managerId: adminUser.id,
      status: 'active',
      skills: ['System Architecture', 'Node.js', 'Angular', 'Leadership', 'Agile'],
      emergencyContact: 'Chloe Mercer (+1 415-555-0888 - Spouse)',
    });

    const emp3 = await Employee.create({
      employeeId: 'AVX-1003',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'hr@aventrix.com',
      phone: '+1 (415) 555-0102',
      dateOfBirth: '1990-04-12',
      gender: 'male',
      department: 'Human Resources',
      designation: 'Senior HR Business Partner',
      joiningDate: '2022-05-10',
      employmentType: 'full_time',
      salary: 110000.0,
      address: '350 Mission St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94105',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      managerId: adminUser.id,
      status: 'active',
      skills: ['Talent Management', 'HR Analytics', 'Compensation & Benefits', 'Conflict Resolution'],
      emergencyContact: 'Laura Vance (+1 415-555-0777 - Spouse)',
    });

    const emp4 = await Employee.create({
      employeeId: 'AVX-1004',
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen@aventrix.com',
      phone: '+1 (415) 555-0105',
      dateOfBirth: '1992-08-25',
      gender: 'male',
      department: 'Engineering',
      designation: 'Backend Architect (Node.js)',
      joiningDate: '2023-03-20',
      employmentType: 'full_time',
      salary: 120000.0,
      address: '88 King St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94107',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      managerId: managerUser.id,
      status: 'active',
      skills: ['Node.js', 'Express', 'Sequelize', 'PostgreSQL', 'Microservices', 'Redis'],
      emergencyContact: 'Mei Chen (+1 415-555-0666 - Mother)',
    });

    const emp5 = await Employee.create({
      employeeId: 'AVX-1005',
      firstName: 'Sophia',
      lastName: 'Taylor',
      email: 'sophia.taylor@aventrix.com',
      phone: '+1 (415) 555-0106',
      dateOfBirth: '1995-12-03',
      gender: 'female',
      department: 'Product Design',
      designation: 'Lead Product Designer',
      joiningDate: '2023-06-01',
      employmentType: 'full_time',
      salary: 105000.0,
      address: '450 Sutter St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94108',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      managerId: managerUser.id,
      status: 'active',
      skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility'],
      emergencyContact: 'Oliver Taylor (+1 415-555-0555 - Father)',
    });

    const emp6 = await Employee.create({
      employeeId: 'AVX-1006',
      firstName: 'Liam',
      lastName: 'Wilson',
      email: 'liam.wilson@aventrix.com',
      phone: '+1 (415) 555-0107',
      dateOfBirth: '1993-02-18',
      gender: 'male',
      department: 'Sales & Marketing',
      designation: 'Enterprise Account Executive',
      joiningDate: '2024-02-15',
      employmentType: 'full_time',
      salary: 98000.0,
      address: '100 Montgomery St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94104',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      managerId: adminUser.id,
      status: 'active',
      skills: ['SaaS Sales', 'CRM', 'Contract Negotiation', 'Lead Generation'],
      emergencyContact: 'Grace Wilson (+1 415-555-0444 - Spouse)',
    });

    // 6. Leave Balances
    const employees = [emp1, emp2, emp3, emp4, emp5, emp6];
    for (const emp of employees) {
      await LeaveBalance.create({
        employeeId: emp.id,
        year: 2026,
        casualLeave: 12,
        casualLeaveUsed: 2,
        sickLeave: 10,
        sickLeaveUsed: 1,
        paidLeave: 15,
        paidLeaveUsed: 3,
        earnedLeave: 8,
        earnedLeaveUsed: 0,
      });
    }

    // 7. Projects
    const proj1 = await Project.create({
      name: 'Aventrix NextGen HR Portal',
      code: 'PRJ-AVX-01',
      description: 'End-to-end modernization of enterprise workforce and performance suites.',
      projectManagerId: managerUser.id,
      teamMemberIds: [emp1.id, emp4.id, emp5.id],
      startDate: '2026-01-10',
      endDate: '2026-11-30',
      status: 'Active',
      priority: 'High',
      progress: 68,
      budget: 180000.0,
    });

    const proj2 = await Project.create({
      name: 'Cloud Infrastructure Migration',
      code: 'PRJ-AVX-02',
      description: 'Zero-downtime containerized Kubernetes deployment and multi-region failover.',
      projectManagerId: managerUser.id,
      teamMemberIds: [emp4.id],
      startDate: '2026-03-01',
      endDate: '2026-08-15',
      status: 'Active',
      priority: 'Urgent',
      progress: 45,
      budget: 95000.0,
    });

    const proj3 = await Project.create({
      name: 'Unified Design System 2.0',
      code: 'PRJ-AVX-03',
      description: 'Enterprise component library, token engine, and WCAG AAA accessibility audit.',
      projectManagerId: managerUser.id,
      teamMemberIds: [emp1.id, emp5.id],
      startDate: '2026-02-01',
      endDate: '2026-06-30',
      status: 'Completed',
      priority: 'Medium',
      progress: 100,
      budget: 45000.0,
    });

    // 8. Tasks (Kanban board ready)
    const task1 = await Task.create({
      title: 'Implement Interactive Kanban Task Board',
      description: 'Build dynamic drag-and-drop task columns with status transitions and filters.',
      projectId: proj1.id,
      assignedEmployeeId: emp1.id,
      assignedById: managerUser.id,
      priority: 'High',
      status: 'In Progress',
      startDate: '2026-09-25',
      dueDate: '2026-10-05',
      estimatedHours: 24,
      actualHours: 14,
    });

    const task2 = await Task.create({
      title: 'Optimize REST APIs with Caching & Indexes',
      description: 'Add indexes to attendance, leaves, and employee queries for sub-50ms response.',
      projectId: proj1.id,
      assignedEmployeeId: emp4.id,
      assignedById: managerUser.id,
      priority: 'Urgent',
      status: 'Todo',
      startDate: '2026-10-01',
      dueDate: '2026-10-08',
      estimatedHours: 16,
      actualHours: 0,
    });

    const task3 = await Task.create({
      title: 'Design Dark Mode Color Tokens & SVG Icons',
      description: 'Deliver comprehensive Lucide icon specs and high-contrast palette tokens.',
      projectId: proj1.id,
      assignedEmployeeId: emp5.id,
      assignedById: managerUser.id,
      priority: 'Medium',
      status: 'In Review',
      startDate: '2026-09-20',
      dueDate: '2026-09-30',
      estimatedHours: 20,
      actualHours: 18,
    });

    const task4 = await Task.create({
      title: 'Automated Leave Balance & Accrual Engine',
      description: 'Implement monthly leave quota accrual cron job and rollover calculations.',
      projectId: proj1.id,
      assignedEmployeeId: emp1.id,
      assignedById: managerUser.id,
      priority: 'Medium',
      status: 'Completed',
      startDate: '2026-09-10',
      dueDate: '2026-09-22',
      estimatedHours: 18,
      actualHours: 17.5,
    });

    const task5 = await Task.create({
      title: 'Audit Logging & RBAC Security Verification',
      description: 'Enforce strict backend role authorization and activity trail recording.',
      projectId: proj2.id,
      assignedEmployeeId: emp4.id,
      assignedById: managerUser.id,
      priority: 'Urgent',
      status: 'In Progress',
      startDate: '2026-09-28',
      dueDate: '2026-10-03',
      estimatedHours: 12,
      actualHours: 6,
    });

    // Task Comments
    await TaskComment.bulkCreate([
      {
        taskId: task1.id,
        userId: managerUser.id,
        userName: 'Alex Mercer',
        userRole: 'manager',
        comment: 'Great progress on the board layout! Ensure mobile swipe works smoothly.',
      },
      {
        taskId: task1.id,
        userId: employeeUser.id,
        userName: 'Elena Rostova',
        userRole: 'employee',
        comment: 'Working on column drop animations and quick search filters now.',
      },
    ]);

    // 9. Attendance (Today and Past Days)
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();

    // Elena checked in today
    const checkInElena = new Date(now);
    checkInElena.setHours(9, 2, 0, 0);
    await Attendance.create({
      employeeId: emp1.id,
      date: todayStr,
      checkInTime: checkInElena,
      checkOutTime: null,
      breakDurationMinutes: 15,
      totalWorkingHours: 6.5,
      status: 'Present',
      notes: 'Checked in on time via web terminal.',
    });

    // David checked in late today
    const checkInDavid = new Date(now);
    checkInDavid.setHours(9, 45, 0, 0);
    await Attendance.create({
      employeeId: emp4.id,
      date: todayStr,
      checkInTime: checkInDavid,
      checkOutTime: null,
      breakDurationMinutes: 0,
      totalWorkingHours: 5.8,
      status: 'Late',
      notes: 'Traffic delay on Bay Bridge.',
    });

    // Sophia is on approved leave today
    await Attendance.create({
      employeeId: emp5.id,
      date: todayStr,
      checkInTime: null,
      checkOutTime: null,
      breakDurationMinutes: 0,
      totalWorkingHours: 0,
      status: 'On Leave',
      notes: 'Scheduled Paid Vacation.',
    });

    // Alex checked in and completed full shift today
    const checkInAlex = new Date(now);
    checkInAlex.setHours(8, 45, 0, 0);
    const checkOutAlex = new Date(now);
    checkOutAlex.setHours(17, 15, 0, 0);
    await Attendance.create({
      employeeId: emp2.id,
      date: todayStr,
      checkInTime: checkInAlex,
      checkOutTime: checkOutAlex,
      breakDurationMinutes: 45,
      totalWorkingHours: 8.0,
      status: 'Present',
      notes: 'Standard 8-hour shift completed.',
    });

    // Past 7 days attendance for Elena
    for (let i = 1; i <= 7; i++) {
      const pastDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayOfWeek = pastDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

      const dateStr = pastDate.toISOString().split('T')[0];
      const pastIn = new Date(pastDate);
      pastIn.setHours(9, 0, 0, 0);
      const pastOut = new Date(pastDate);
      pastOut.setHours(17, 30, 0, 0);

      await Attendance.create({
        employeeId: emp1.id,
        date: dateStr,
        checkInTime: pastIn,
        checkOutTime: pastOut,
        breakDurationMinutes: 30,
        totalWorkingHours: 8.0,
        status: 'Present',
      });
    }

    // 10. Leave Requests
    await LeaveRequest.create({
      employeeId: emp1.id,
      leaveType: 'Paid Leave',
      startDate: '2026-10-15',
      endDate: '2026-10-16',
      numberOfDays: 2,
      reason: 'Attending Angular Global Tech Summit.',
      status: 'Pending',
    });

    await LeaveRequest.create({
      employeeId: emp4.id,
      leaveType: 'Casual Leave',
      startDate: '2026-10-12',
      endDate: '2026-10-12',
      numberOfDays: 1,
      reason: 'Personal family event.',
      status: 'Approved',
      reviewedById: managerUser.id,
      reviewComment: 'Approved. Enjoy your time off!',
    });

    await LeaveRequest.create({
      employeeId: emp5.id,
      leaveType: 'Sick Leave',
      startDate: todayStr,
      endDate: todayStr,
      numberOfDays: 1,
      reason: 'Flu symptoms and medical rest.',
      status: 'Approved',
      reviewedById: managerUser.id,
      reviewComment: 'Approved. Get well soon Sophia.',
    });

    // 11. Timesheets
    await Timesheet.create({
      employeeId: emp1.id,
      taskId: task1.id,
      projectId: proj1.id,
      workDate: todayStr,
      hours: 6.5,
      description: 'Built drag and drop column views and updated reactive state management.',
      status: 'Submitted',
      submittedAt: new Date(),
    });

    await Timesheet.create({
      employeeId: emp4.id,
      taskId: task5.id,
      projectId: proj2.id,
      workDate: todayStr,
      hours: 5.5,
      description: 'Configured role middleware guards and audit trail interceptors.',
      status: 'Submitted',
      submittedAt: new Date(),
    });

    // 12. Payroll Records
    await Payroll.create({
      employeeId: emp1.id,
      month: 9,
      year: 2026,
      basicSalary: 6000.0,
      hra: 1200.0,
      allowances: 400.0,
      bonus: 300.0,
      taxDeduction: 650.0,
      pfDeduction: 350.0,
      otherDeductions: 0.0,
      netSalary: 6900.0,
      paymentStatus: 'Paid',
      paymentDate: '2026-09-28',
      paymentMethod: 'Direct Deposit / Wire',
      notes: 'September 2026 Standard Salary Disbursed.',
    });

    await Payroll.create({
      employeeId: emp2.id,
      month: 9,
      year: 2026,
      basicSalary: 9500.0,
      hra: 1800.0,
      allowances: 600.0,
      bonus: 800.0,
      taxDeduction: 1200.0,
      pfDeduction: 500.0,
      otherDeductions: 0.0,
      netSalary: 11000.0,
      paymentStatus: 'Paid',
      paymentDate: '2026-09-28',
      paymentMethod: 'Direct Deposit / Wire',
      notes: 'September 2026 Manager Payroll Disbursed.',
    });

    await Payroll.create({
      employeeId: emp3.id,
      month: 9,
      year: 2026,
      basicSalary: 7200.0,
      hra: 1400.0,
      allowances: 500.0,
      bonus: 400.0,
      taxDeduction: 800.0,
      pfDeduction: 400.0,
      otherDeductions: 0.0,
      netSalary: 8300.0,
      paymentStatus: 'Paid',
      paymentDate: '2026-09-28',
      paymentMethod: 'Direct Deposit / Wire',
      notes: 'September 2026 HR Payroll Disbursed.',
    });

    // 13. Notifications
    await Notification.bulkCreate([
      {
        userId: employeeUser.id,
        title: 'New Task Assigned',
        message: 'Alex Mercer assigned you to task "Implement Interactive Kanban Task Board".',
        type: 'Task Assigned',
        read: false,
        link: '/tasks',
      },
      {
        userId: employeeUser.id,
        title: 'Payroll Disbursed',
        message: 'Your salary slip for September 2026 is now available for download.',
        type: 'Payroll',
        read: true,
        link: '/payroll',
      },
      {
        userId: managerUser.id,
        title: 'Pending Leave Request',
        message: 'Elena Rostova submitted a leave request for Oct 15 - Oct 16.',
        type: 'Leave Approval',
        read: false,
        link: '/leave',
      },
      {
        userId: managerUser.id,
        title: 'Timesheet Submitted',
        message: 'David Chen submitted a timesheet for review (5.5 hrs).',
        type: 'Timesheet Approval',
        read: false,
        link: '/timesheets',
      },
      {
        userId: adminUser.id,
        title: 'System Security Audit Completed',
        message: 'All API routes and role authorization policies verified successfully.',
        type: 'Security',
        read: true,
        link: '/settings',
      },
    ]);

    // 14. Announcements
    await Announcement.bulkCreate([
      {
        title: 'Aventrix Annual Tech & Innovation Summit 2026',
        content:
          'We are delighted to announce the Aventrix Annual Summit scheduled for November 12-14. Keynotes from industry leaders, hackathons, and team recognition awards!',
        targetRole: 'ALL',
        priority: 'High',
        authorId: adminUser.id,
        authorName: 'Sarah Jenkins',
      },
      {
        title: 'Q4 Health Insurance & Wellness Benefits Open Enrollment',
        content:
          'The annual open enrollment window for medical, dental, and vision insurance begins next Monday. Check your employee portal documents for enrollment guides.',
        targetRole: 'ALL',
        priority: 'Normal',
        authorId: hrUser.id,
        authorName: 'Marcus Vance',
      },
    ]);

    // 15. Candidates & Onboarding
    await Candidate.bulkCreate([
      {
        fullName: 'Nathan Drake',
        email: 'nathan.d@example.com',
        phone: '+1 (415) 555-8811',
        appliedPosition: 'Senior Full Stack Engineer',
        department: 'Engineering',
        experienceYears: 6.5,
        status: 'Interview',
        interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        interviewerName: 'Alex Mercer',
        notes: 'Impressive GitHub portfolio and deep Angular/Node experience.',
      },
      {
        fullName: 'Claire Redfield',
        email: 'claire.r@example.com',
        phone: '+1 (415) 555-8822',
        appliedPosition: 'UI/UX Designer',
        department: 'Product Design',
        experienceYears: 4.0,
        status: 'Offered',
        interviewerName: 'Sophia Taylor',
        notes: 'Exceptional visual design sense and mastery of design tokens.',
      },
    ]);

    await Onboarding.create({
      candidateName: 'Jonathan Brandis',
      candidateEmail: 'jonathan.b@aventrix.com',
      position: 'DevOps Engineer',
      department: 'Engineering',
      startDate: '2026-10-15',
      status: 'In Progress',
      tasks: [
        { id: 1, title: 'Submit Identification & Tax Documents', completed: true },
        { id: 2, title: 'Signed Employment Contract', completed: true },
        { id: 3, title: 'Setup Company Email & GitHub Account', completed: true },
        { id: 4, title: 'Hardware & Workstation Provisioning', completed: false },
        { id: 5, title: 'HR Policy & Security Orientation', completed: false },
        { id: 6, title: 'Team Introduction & Sprint Planning', completed: false },
      ],
      notes: 'Laptop shipped via FedEx. Tracking ID: FX-89230198.',
    });

    // 16. Expense Claims
    await ExpenseClaim.create({
      employeeId: emp1.id,
      title: 'Angular Developer Conference Registration',
      category: 'Training',
      amount: 450.0,
      claimDate: '2026-09-22',
      description: 'Conference ticket for AngularConnect 2026.',
      receiptUrl: 'https://example.com/receipts/rec-01.pdf',
      status: 'Approved',
      reviewedById: managerUser.id,
      reviewComment: 'Approved under professional education budget.',
    });

    await ExpenseClaim.create({
      employeeId: emp4.id,
      title: 'Ergonomic Standing Desk Converter',
      category: 'Equipment',
      amount: 280.0,
      claimDate: '2026-09-29',
      description: 'Remote office workstation ergonomic equipment.',
      receiptUrl: 'https://example.com/receipts/rec-02.pdf',
      status: 'Pending',
    });

    // 17. Audit Logs
    await AuditLog.bulkCreate([
      {
        userId: adminUser.id,
        userName: 'Sarah Jenkins',
        userRole: 'admin',
        action: 'UPDATE_COMPANY_SETTINGS',
        module: 'Settings',
        details: 'Updated company working hours and late threshold rules.',
        ipAddress: '192.168.1.100',
      },
      {
        userId: hrUser.id,
        userName: 'Marcus Vance',
        userRole: 'hr',
        action: 'DISBURSE_PAYROLL',
        module: 'Payroll',
        details: 'Disbursed September 2026 payroll batch for 6 active employees.',
        ipAddress: '192.168.1.102',
      },
    ]);

    console.log('==========================================================');
    console.log('✅ AVENTRIX HRMS SEED DATA GENERATED SUCCESSFULLY!');
    console.log('==========================================================');
    console.log('Default Credentials:');
    console.log('1. Admin:    admin@aventrix.com    / Admin@123456');
    console.log('2. HR:       hr@aventrix.com       / Hr@123456');
    console.log('3. Manager:  manager@aventrix.com  / Manager@123456');
    console.log('4. Employee: employee@aventrix.com / Employee@123456');
    console.log('==========================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
