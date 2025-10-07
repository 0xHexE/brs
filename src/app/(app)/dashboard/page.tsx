'use client';

import {
  BookOpen,
  Calendar,
  ChartBar,
  Clock,
  CreditCard,
  GraduationCap,
  Mail,
  Phone,
  User,
  Users,
  Award,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Library,
  FileText,
  Bell,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuthUser } from '@/hooks/use-auth-user';

interface StudentInfo {
  fullName: string;
  universityId: string;
  email: string;
  admissionYear: number;
  currentSemester: number;
  cgpa: number;
  programme: string;
  department: string;
  faculty: string;
  degreeType: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  creditHours: number;
  semester: string;
  lecturer: string;
  grade?: string;
  attendance: number;
  status: 'ongoing' | 'completed' | 'upcoming';
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  date: Date;
  type: 'general' | 'academic' | 'urgent';
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'overdue';
  grade?: number;
}

export default function StudentDashboard() {
  const { user, loading } = useAuthUser();
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    // Mock student data - in real app, this would come from API
    const mockStudentInfo: StudentInfo = {
      fullName: user?.fullName || 'John Doe',
      universityId: '2021001234',
      email: user?.email || 'john.doe@university.edu',
      admissionYear: 2021,
      currentSemester: 5,
      cgpa: 3.75,
      programme: 'Bachelor of Computer Science',
      department: 'Computer Science',
      faculty: 'Engineering & Technology',
      degreeType: 'bachelor',
    };

    const mockCourses: Course[] = [
      {
        id: '1',
        code: 'CS301',
        title: 'Web Development',
        creditHours: 3,
        semester: 'Fall 2025',
        lecturer: 'Dr. Emily Davis',
        grade: 'A-',
        attendance: 92,
        status: 'ongoing',
      },
      {
        id: '2',
        code: 'CS302',
        title: 'Database Systems',
        creditHours: 3,
        semester: 'Fall 2025',
        lecturer: 'Dr. Robert Wilson',
        attendance: 88,
        status: 'ongoing',
      },
      {
        id: '3',
        code: 'CS201',
        title: 'Data Structures & Algorithms',
        creditHours: 4,
        semester: 'Spring 2025',
        lecturer: 'Prof. Michael Chen',
        grade: 'B+',
        attendance: 95,
        status: 'completed',
      },
      {
        id: '4',
        code: 'MATH201',
        title: 'Discrete Mathematics',
        creditHours: 3,
        semester: 'Fall 2025',
        lecturer: 'Dr. Sarah Johnson',
        attendance: 85,
        status: 'ongoing',
      },
    ];

    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Midterm Examination Schedule',
        message: 'Midterm examinations will begin from October 15, 2025. Please check your individual schedules.',
        date: new Date('2025-10-01'),
        type: 'academic',
      },
      {
        id: '2',
        title: 'Library Hours Extended',
        message: 'Library hours will be extended during the examination period until 11 PM.',
        date: new Date('2025-10-03'),
        type: 'general',
      },
      {
        id: '3',
        title: 'Course Registration Deadline',
        message: 'Last date to register for Spring 2026 courses is November 30, 2025.',
        date: new Date('2025-10-05'),
        type: 'urgent',
      },
    ];

    const mockAssignments: Assignment[] = [
      {
        id: '1',
        title: 'Web Development Project',
        course: 'CS301',
        dueDate: new Date('2025-10-12'),
        status: 'pending',
      },
      {
        id: '2',
        title: 'Database Design Assignment',
        course: 'CS302',
        dueDate: new Date('2025-10-08'),
        status: 'submitted',
        grade: 85,
      },
      {
        id: '3',
        title: 'Algorithm Analysis',
        course: 'CS201',
        dueDate: new Date('2025-10-05'),
        status: 'overdue',
      },
    ];

    setStudentInfo(mockStudentInfo);
    setCourses(mockCourses);
    setAnnouncements(mockAnnouncements);
    setAssignments(mockAssignments);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!studentInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Unable to load student information</p>
      </div>
    );
  }

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    const gradeColors: { [key: string]: string } = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'A-': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'C-': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800',
    };
    return gradeColors[grade] || 'bg-gray-100 text-gray-800';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAssignmentStatusColor = (status: Assignment['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      submitted: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getAnnouncementIcon = (type: Announcement['type']) => {
    const icons = {
      general: Bell,
      academic: GraduationCap,
      urgent: AlertCircle,
    };
    return icons[type];
  };

  const getAnnouncementColor = (type: Announcement['type']) => {
    const colors = {
      general: 'bg-blue-50 border-blue-200',
      academic: 'bg-green-50 border-green-200',
      urgent: 'bg-red-50 border-red-200',
    };
    return colors[type];
  };

  const currentCourses = courses.filter(course => course.status === 'ongoing');
  const completedCourses = courses.filter(course => course.status === 'completed');
  const pendingAssignments = assignments.filter(assignment => assignment.status === 'pending');
  const overdueAssignments = assignments.filter(assignment => assignment.status === 'overdue');

  return (
    <div className="space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {studentInfo.fullName}!
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Academic Year</p>
          <p className="text-lg font-semibold">2025-2026</p>
        </div>
      </div>

      {/* Student Information Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Full Name
              </div>
              <p className="font-medium">{studentInfo.fullName}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                University ID
              </div>
              <p className="font-medium">{studentInfo.universityId}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="font-medium text-sm">{studentInfo.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Admission Year
              </div>
              <p className="font-medium">{studentInfo.admissionYear}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Semester {studentInfo.currentSemester}</div>
            <p className="text-xs text-muted-foreground">
              Fall 2025
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CGPA</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentInfo.cgpa.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +0.15 from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              {currentCourses.reduce((sum, course) => sum + course.creditHours, 0)} credit hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
            <p className="text-xs text-muted-foreground">
              {overdueAssignments.length} overdue
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Current Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{course.code}</h3>
                      <Badge variant="outline">{course.creditHours} credits</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{course.title}</p>
                    <p className="text-xs text-muted-foreground">Instructor: {course.lecturer}</p>
                  </div>
                  <div className="text-right">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Attendance:</span>
                        <span className={`text-sm font-medium ${getAttendanceColor(course.attendance)}`}>
                          {course.attendance}%
                        </span>
                      </div>
                      <Progress value={course.attendance} className="w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.slice(0, 4).map((announcement) => {
                const Icon = getAnnouncementIcon(announcement.type);
                return (
                  <div
                    key={announcement.id}
                    className={`p-3 rounded-lg border ${getAnnouncementColor(announcement.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{announcement.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {announcement.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {announcement.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments and Academic Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments.slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{assignment.title}</h4>
                    <p className="text-xs text-muted-foreground">{assignment.course}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {assignment.dueDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getAssignmentStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                    {assignment.grade && (
                      <p className="text-xs text-muted-foreground mt-1">Grade: {assignment.grade}%</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Academic Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="h-5 w-5" />
              Academic Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Program Completion</span>
                  <span>62.5%</span>
                </div>
                <Progress value={62.5} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Credit Hours Completed</span>
                  <span>75/120</span>
                </div>
                <Progress value={62.5} />
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-3">Recent Grades</h4>
                <div className="space-y-2">
                  {completedCourses.slice(0, 3).map((course) => (
                    <div key={course.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{course.code}</p>
                        <p className="text-xs text-muted-foreground">{course.title}</p>
                      </div>
                      <Badge className={getGradeColor(course.grade)}>
                        {course.grade}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button type="button" className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors">
              <Library className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Library</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors">
              <CreditCard className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Fee Payment</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors">
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Transcript</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors">
              <Users className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Support</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
