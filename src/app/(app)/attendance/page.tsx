'use client';

import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
  Search,
  User,
  BookOpen,
  Award,
  Target,
  CalendarDays,
  Activity,
  Download,
  FileText,
  Bell,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthUser } from '@/hooks/use-auth-user';

interface AttendanceRecord {
  id: string;
  date: Date;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: Date;
  checkOutTime?: Date;
  duration?: number; // in minutes
  room: string;
  notes?: string;
  method: 'manual' | 'automatic' | 'biometric' | 'card';
}

interface CourseAttendance {
  courseCode: string;
  courseTitle: string;
  instructor: string;
  totalClasses: number;
  presentClasses: number;
  absentClasses: number;
  lateClasses: number;
  excusedClasses: number;
  attendancePercentage: number;
  recentRecords: AttendanceRecord[];
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room: string;
  }[];
}

interface AttendanceStatistics {
  overallAttendance: number;
  totalClasses: number;
  presentClasses: number;
  absentClasses: number;
  lateClasses: number;
  excusedClasses: number;
  currentStreak: number;
  longestStreak: number;
  monthlyAttendance: {
    month: string;
    percentage: number;
    classes: number;
  }[];
  attendanceTrend: 'improving' | 'declining' | 'stable';
  perfectAttendanceCourses: string[];
}

interface AttendanceAlert {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  courseCode?: string;
  date: Date;
  actionRequired: boolean;
}

export default function AttendancePage() {
  const { user, loading } = useAuthUser();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [courseAttendance, setCourseAttendance] = useState<CourseAttendance[]>([]);
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(null);
  const [alerts, setAlerts] = useState<AttendanceAlert[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'calendar' | 'detailed'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock attendance data - in real app, this would come from API
    const mockAttendanceRecords: AttendanceRecord[] = [
      {
        id: '1',
        date: new Date('2025-10-05'),
        courseCode: 'CS301',
        courseTitle: 'Web Development',
        instructor: 'Dr. Emily Davis',
        status: 'present',
        checkInTime: new Date('2025-10-05T09:00:00'),
        checkOutTime: new Date('2025-10-05T10:30:00'),
        duration: 90,
        room: 'Lab 401',
        method: 'automatic',
      },
      {
        id: '2',
        date: new Date('2025-10-03'),
        courseCode: 'CS302',
        courseTitle: 'Database Systems',
        instructor: 'Dr. Robert Wilson',
        status: 'late',
        checkInTime: new Date('2025-10-03T14:15:00'),
        checkOutTime: new Date('2025-10-05T15:30:00'),
        duration: 75,
        room: 'Room 202',
        notes: 'Traffic delay',
        method: 'manual',
      },
      {
        id: '3',
        date: new Date('2025-10-01'),
        courseCode: 'MATH201',
        courseTitle: 'Discrete Mathematics',
        instructor: 'Dr. Sarah Johnson',
        status: 'present',
        checkInTime: new Date('2025-10-01T11:00:00'),
        checkOutTime: new Date('2025-10-01T12:15:00'),
        duration: 75,
        room: 'Room 301',
        method: 'biometric',
      },
      {
        id: '4',
        date: new Date('2025-09-29'),
        courseCode: 'CS301',
        courseTitle: 'Web Development',
        instructor: 'Dr. Emily Davis',
        status: 'absent',
        room: 'Lab 401',
        notes: 'Medical appointment',
        method: 'manual',
      },
      {
        id: '5',
        date: new Date('2025-09-28'),
        courseCode: 'ENG101',
        courseTitle: 'Academic Writing',
        instructor: 'Dr. James Miller',
        status: 'present',
        checkInTime: new Date('2025-09-28T10:00:00'),
        checkOutTime: new Date('2025-09-28T11:15:00'),
        duration: 75,
        room: 'Room 105',
        method: 'automatic',
      },
      {
        id: '6',
        date: new Date('2025-09-26'),
        courseCode: 'CS201',
        courseTitle: 'Data Structures & Algorithms',
        instructor: 'Prof. Michael Chen',
        status: 'excused',
        room: 'Room 305',
        notes: 'University approved event',
        method: 'manual',
      },
      {
        id: '7',
        date: new Date('2025-09-24'),
        courseCode: 'CS302',
        courseTitle: 'Database Systems',
        instructor: 'Dr. Robert Wilson',
        status: 'present',
        checkInTime: new Date('2025-09-24T14:00:00'),
        checkOutTime: new Date('2025-09-24T15:30:00'),
        duration: 90,
        room: 'Room 202',
        method: 'automatic',
      },
    ];

    const mockCourseAttendance: CourseAttendance[] = [
      {
        courseCode: 'CS301',
        courseTitle: 'Web Development',
        instructor: 'Dr. Emily Davis',
        totalClasses: 12,
        presentClasses: 10,
        absentClasses: 1,
        lateClasses: 1,
        excusedClasses: 0,
        attendancePercentage: 83.3,
        recentRecords: mockAttendanceRecords.filter(r => r.courseCode === 'CS301'),
        schedule: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '10:30', room: 'Lab 401' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '10:30', room: 'Lab 401' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '10:30', room: 'Lab 401' },
        ],
      },
      {
        courseCode: 'CS302',
        courseTitle: 'Database Systems',
        instructor: 'Dr. Robert Wilson',
        totalClasses: 10,
        presentClasses: 8,
        absentClasses: 0,
        lateClasses: 2,
        excusedClasses: 0,
        attendancePercentage: 80.0,
        recentRecords: mockAttendanceRecords.filter(r => r.courseCode === 'CS302'),
        schedule: [
          { dayOfWeek: 2, startTime: '14:00', endTime: '15:30', room: 'Room 202' },
          { dayOfWeek: 4, startTime: '14:00', endTime: '15:30', room: 'Room 202' },
        ],
      },
      {
        courseCode: 'MATH201',
        courseTitle: 'Discrete Mathematics',
        instructor: 'Dr. Sarah Johnson',
        totalClasses: 8,
        presentClasses: 7,
        absentClasses: 0,
        lateClasses: 1,
        excusedClasses: 0,
        attendancePercentage: 87.5,
        recentRecords: mockAttendanceRecords.filter(r => r.courseCode === 'MATH201'),
        schedule: [
          { dayOfWeek: 1, startTime: '11:00', endTime: '12:15', room: 'Room 301' },
          { dayOfWeek: 3, startTime: '11:00', endTime: '12:15', room: 'Room 301' },
          { dayOfWeek: 5, startTime: '11:00', endTime: '12:15', room: 'Room 301' },
        ],
      },
      {
        courseCode: 'ENG101',
        courseTitle: 'Academic Writing',
        instructor: 'Dr. James Miller',
        totalClasses: 6,
        presentClasses: 6,
        absentClasses: 0,
        lateClasses: 0,
        excusedClasses: 0,
        attendancePercentage: 100.0,
        recentRecords: mockAttendanceRecords.filter(r => r.courseCode === 'ENG101'),
        schedule: [
          { dayOfWeek: 2, startTime: '10:00', endTime: '11:15', room: 'Room 105' },
          { dayOfWeek: 4, startTime: '10:00', endTime: '11:15', room: 'Room 105' },
        ],
      },
      {
        courseCode: 'CS201',
        courseTitle: 'Data Structures & Algorithms',
        instructor: 'Prof. Michael Chen',
        totalClasses: 14,
        presentClasses: 12,
        absentClasses: 1,
        lateClasses: 0,
        excusedClasses: 1,
        attendancePercentage: 85.7,
        recentRecords: mockAttendanceRecords.filter(r => r.courseCode === 'CS201'),
        schedule: [
          { dayOfWeek: 2, startTime: '11:00', endTime: '12:30', room: 'Room 305' },
          { dayOfWeek: 4, startTime: '11:00', endTime: '12:30', room: 'Room 305' },
        ],
      },
    ];

    const mockStatistics: AttendanceStatistics = {
      overallAttendance: 87.3,
      totalClasses: 50,
      presentClasses: 43,
      absentClasses: 2,
      lateClasses: 4,
      excusedClasses: 1,
      currentStreak: 8,
      longestStreak: 15,
      monthlyAttendance: [
        { month: 'September 2025', percentage: 89.2, classes: 22 },
        { month: 'August 2025', percentage: 91.5, classes: 18 },
        { month: 'July 2025', percentage: 85.0, classes: 10 },
      ],
      attendanceTrend: 'stable',
      perfectAttendanceCourses: ['ENG101'],
    };

    const mockAlerts: AttendanceAlert[] = [
      {
        id: '1',
        type: 'warning',
        message: 'Your attendance in CS302 is below 80%. Regular attendance is important for academic success.',
        courseCode: 'CS302',
        date: new Date('2025-10-03'),
        actionRequired: true,
      },
      {
        id: '2',
        type: 'success',
        message: 'Perfect attendance in ENG101! Keep up the excellent work.',
        courseCode: 'ENG101',
        date: new Date('2025-10-01'),
        actionRequired: false,
      },
      {
        id: '3',
        type: 'info',
        message: 'Remember to submit attendance verification for medical appointments.',
        date: new Date('2025-09-29'),
        actionRequired: false,
      },
    ];

    setAttendanceRecords(mockAttendanceRecords);
    setCourseAttendance(mockCourseAttendance);
    setStatistics(mockStatistics);
    setAlerts(mockAlerts);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Unable to load attendance information</p>
      </div>
    );
  }

  const getStatusColor = (status: AttendanceRecord['status']) => {
    const colors = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      excused: 'bg-blue-100 text-blue-800',
    };
    return colors[status];
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    const icons = {
      present: CheckCircle,
      absent: XCircle,
      late: Clock,
      excused: AlertCircle,
    };
    return icons[status];
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-blue-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlertIcon = (type: AttendanceAlert['type']) => {
    const icons = {
      warning: AlertCircle,
      info: Bell,
      success: CheckCircle,
    };
    return icons[type];
  };

  const getAlertColor = (type: AttendanceAlert['type']) => {
    const colors = {
      warning: 'bg-yellow-50 border-yellow-200',
      info: 'bg-blue-50 border-blue-200',
      success: 'bg-green-50 border-green-200',
    };
    return colors[type];
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesCourse = selectedCourse === 'all' || record.courseCode === selectedCourse;
    const matchesSearch = record.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const recentRecords = filteredRecords.slice(0, 10);
  const todayRecords = filteredRecords.filter(record => 
    record.date.toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">
            Track your class attendance and participation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAttendanceColor(statistics.overallAttendance)}`}>
              {statistics.overallAttendance.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics.presentClasses}/{statistics.totalClasses} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">
              Longest: {statistics.longestStreak} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.monthlyAttendance[0]?.percentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics.monthlyAttendance[0]?.classes} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfect Attendance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.perfectAttendanceCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              Courses this semester
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">View:</span>
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('overview')}
            >
              Overview
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              Calendar
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('detailed')}
            >
              Detailed
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Course:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-1 border border-border rounded-md bg-card text-foreground text-sm"
          >
            <option value="all">All Courses</option>
            {courseAttendance.map(course => (
              <option key={course.courseCode} value={course.courseCode}>
                {course.courseCode} - {course.courseTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {viewMode === 'overview' && (
        <>
          {/* Today's Attendance */}
          {todayRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayRecords.map((record) => {
                    const Icon = getStatusIcon(record.status);
                    return (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(record.status)}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{record.courseCode}</h4>
                            <p className="text-sm text-muted-foreground">{record.courseTitle}</p>
                            <p className="text-xs text-muted-foreground">{record.instructor} • {record.room}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                          {record.checkInTime && (
                            <p className="text-xs text-muted-foreground mt-1">
                              In: {record.checkInTime.toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Attendance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Attendance by Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseAttendance.map((course) => (
                    <div key={course.courseCode} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{course.courseCode}</h4>
                          {statistics.perfectAttendanceCourses.includes(course.courseCode) && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{course.courseTitle}</p>
                        <p className="text-xs text-muted-foreground">{course.instructor}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {course.presentClasses} present
                          </span>
                          <span className="flex items-center gap-1">
                            <XCircle className="h-3 w-3 text-red-600" />
                            {course.absentClasses} absent
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-yellow-600" />
                            {course.lateClasses} late
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getAttendanceColor(course.attendancePercentage)}`}>
                          {course.attendancePercentage.toFixed(1)}%
                        </div>
                        <Progress value={course.attendancePercentage} className="w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Attendance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const Icon = getAlertIcon(alert.type);
                    return (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                      >
                        <div className="flex items-start gap-2">
                          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{alert.message}</p>
                            {alert.courseCode && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {alert.courseCode} • {alert.date.toLocaleDateString()}
                              </p>
                            )}
                            {alert.actionRequired && (
                              <Button variant="outline" size="sm" className="mt-2">
                                Take Action
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Attendance Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRecords.map((record) => {
                  const Icon = getStatusIcon(record.status);
                  return (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(record.status)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{record.courseCode}</h4>
                          <p className="text-sm text-muted-foreground">{record.courseTitle}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{record.date.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{record.room}</span>
                            {record.duration && (
                              <>
                                <span>•</span>
                                <span>{record.duration} min</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        {record.checkInTime && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {record.checkInTime.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Attendance Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Calendar view will be implemented with a full calendar component</p>
              <p className="text-sm">Showing daily attendance patterns and trends</p>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'detailed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detailed Attendance Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecords.map((record) => {
                const Icon = getStatusIcon(record.status);
                return (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(record.status)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{record.courseCode}</h3>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-1">{record.courseTitle}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {record.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {record.date.toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {record.room}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {record.checkInTime && (
                          <div className="text-sm">
                            <p className="font-medium">Check-in: {record.checkInTime.toLocaleTimeString()}</p>
                            {record.checkOutTime && (
                              <p className="text-muted-foreground">Check-out: {record.checkOutTime.toLocaleTimeString()}</p>
                            )}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          Method: {record.method}
                        </div>
                      </div>
                    </div>

                    {record.notes && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                        <p className="text-sm"><strong>Notes:</strong> {record.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        {record.duration && (
                          <span className="text-sm text-muted-foreground">
                            Duration: {record.duration} minutes
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {record.status === 'absent' && (
                          <Button variant="outline" size="sm">
                            Request Excuse
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}