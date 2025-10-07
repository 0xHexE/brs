'use client';

import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  MapPin,
  User,
  Award,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  Star,
  FileText,
  Download,
  Play,
  ExternalLink,
  Bell,
  Target,
  GraduationCap,
  Library,
  MessageSquare,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthUser } from '@/hooks/use-auth-user';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  instructor: string;
  instructorEmail: string;
  credits: number;
  semester: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room: string;
  }[];
  department: string;
  faculty: string;
  prerequisites: string[];
  currentGrade?: string;
  attendance: number;
  assignments: {
    total: number;
    completed: number;
    graded: number;
  };
  materials: {
    syllabus: boolean;
    lectures: boolean;
    assignments: boolean;
    resources: boolean;
  };
  announcements: number;
  nextClass?: Date;
  progress: number;
  rating?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'lecture' | 'lab' | 'seminar' | 'online';
}

interface CourseResource {
  id: string;
  courseId: string;
  title: string;
  type: 'lecture' | 'assignment' | 'reading' | 'video' | 'link';
  url?: string;
  downloadUrl?: string;
  uploadedDate: Date;
  size?: string;
  description: string;
}

interface CourseStatistics {
  totalCourses: number;
  ongoingCourses: number;
  completedCourses: number;
  upcomingCourses: number;
  totalCredits: number;
  currentCredits: number;
  averageGrade?: number;
  overallProgress: number;
  favoriteCourses: string[];
  departments: string[];
}

export default function CoursesPage() {
  const { user, loading } = useAuthUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [statistics, setStatistics] = useState<CourseStatistics | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'schedule' | 'detailed'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock courses data - in real app, this would come from API
    const mockCourses: Course[] = [
      {
        id: '1',
        code: 'CS301',
        title: 'Web Development',
        description: 'Comprehensive course on modern web development technologies including HTML5, CSS3, JavaScript, and popular frameworks. Focus on responsive design and user experience.',
        instructor: 'Dr. Emily Davis',
        instructorEmail: 'emily.davis@university.edu',
        credits: 3,
        semester: 'Fall 2025',
        status: 'ongoing',
        schedule: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '10:30', room: 'Lab 401' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '10:30', room: 'Lab 401' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '10:30', room: 'Lab 401' },
        ],
        department: 'Computer Science',
        faculty: 'Engineering & Technology',
        prerequisites: ['CS101', 'CS201'],
        currentGrade: 'A-',
        attendance: 92,
        assignments: { total: 8, completed: 5, graded: 4 },
        materials: {
          syllabus: true,
          lectures: true,
          assignments: true,
          resources: true,
        },
        announcements: 3,
        nextClass: new Date('2025-10-06T09:00:00'),
        progress: 65,
        rating: 4.5,
        difficulty: 'intermediate',
        type: 'lab',
      },
      {
        id: '2',
        code: 'CS302',
        title: 'Database Systems',
        description: 'Introduction to database management systems, SQL, database design, normalization, and transaction management. Includes hands-on experience with modern database systems.',
        instructor: 'Dr. Robert Wilson',
        instructorEmail: 'robert.wilson@university.edu',
        credits: 3,
        semester: 'Fall 2025',
        status: 'ongoing',
        schedule: [
          { dayOfWeek: 2, startTime: '14:00', endTime: '15:30', room: 'Room 202' },
          { dayOfWeek: 4, startTime: '14:00', endTime: '15:30', room: 'Room 202' },
        ],
        department: 'Computer Science',
        faculty: 'Engineering & Technology',
        prerequisites: ['CS101'],
        currentGrade: 'B+',
        attendance: 88,
        assignments: { total: 6, completed: 3, graded: 2 },
        materials: {
          syllabus: true,
          lectures: true,
          assignments: true,
          resources: false,
        },
        announcements: 2,
        nextClass: new Date('2025-10-07T14:00:00'),
        progress: 50,
        rating: 4.2,
        difficulty: 'intermediate',
        type: 'lecture',
      },
      {
        id: '3',
        code: 'MATH201',
        title: 'Discrete Mathematics',
        description: 'Mathematical logic, set theory, combinatorics, graph theory, and algorithms. Foundation for computer science and advanced mathematics.',
        instructor: 'Dr. Sarah Johnson',
        instructorEmail: 'sarah.johnson@university.edu',
        credits: 3,
        semester: 'Fall 2025',
        status: 'ongoing',
        schedule: [
          { dayOfWeek: 1, startTime: '11:00', endTime: '12:15', room: 'Room 301' },
          { dayOfWeek: 3, startTime: '11:00', endTime: '12:15', room: 'Room 301' },
          { dayOfWeek: 5, startTime: '11:00', endTime: '12:15', room: 'Room 301' },
        ],
        department: 'Mathematics',
        faculty: 'Science',
        prerequisites: ['MATH101'],
        currentGrade: 'A',
        attendance: 96,
        assignments: { total: 10, completed: 6, graded: 5 },
        materials: {
          syllabus: true,
          lectures: true,
          assignments: true,
          resources: true,
        },
        announcements: 1,
        nextClass: new Date('2025-10-06T11:00:00'),
        progress: 70,
        rating: 4.7,
        difficulty: 'intermediate',
        type: 'lecture',
      },
      {
        id: '4',
        code: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop academic writing skills, research methodologies, and proper citation techniques. Focus on clarity, coherence, and scholarly communication.',
        instructor: 'Dr. James Miller',
        instructorEmail: 'james.miller@university.edu',
        credits: 2,
        semester: 'Fall 2025',
        status: 'ongoing',
        schedule: [
          { dayOfWeek: 2, startTime: '10:00', endTime: '11:15', room: 'Room 105' },
          { dayOfWeek: 4, startTime: '10:00', endTime: '11:15', room: 'Room 105' },
        ],
        department: 'English',
        faculty: 'Arts & Humanities',
        prerequisites: [],
        currentGrade: 'A-',
        attendance: 98,
        assignments: { total: 5, completed: 3, graded: 2 },
        materials: {
          syllabus: true,
          lectures: false,
          assignments: true,
          resources: true,
        },
        announcements: 0,
        nextClass: new Date('2025-10-07T10:00:00'),
        progress: 60,
        rating: 4.3,
        difficulty: 'beginner',
        type: 'seminar',
      },
      {
        id: '5',
        code: 'CS201',
        title: 'Data Structures & Algorithms',
        description: 'Fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Algorithm analysis and design techniques.',
        instructor: 'Prof. Michael Chen',
        instructorEmail: 'michael.chen@university.edu',
        credits: 4,
        semester: 'Spring 2025',
        status: 'completed',
        schedule: [
          { dayOfWeek: 2, startTime: '11:00', endTime: '12:30', room: 'Room 305' },
          { dayOfWeek: 4, startTime: '11:00', endTime: '12:30', room: 'Room 305' },
        ],
        department: 'Computer Science',
        faculty: 'Engineering & Technology',
        prerequisites: ['CS101'],
        currentGrade: 'B+',
        attendance: 95,
        assignments: { total: 12, completed: 12, graded: 12 },
        materials: {
          syllabus: true,
          lectures: true,
          assignments: true,
          resources: true,
        },
        announcements: 0,
        progress: 100,
        rating: 4.4,
        difficulty: 'intermediate',
        type: 'lecture',
      },
    ];

    const mockResources: CourseResource[] = [
      {
        id: '1',
        courseId: 'CS301',
        title: 'HTML5 & CSS3 Basics',
        type: 'lecture',
        downloadUrl: '/downloads/cs301-lecture1.pdf',
        uploadedDate: new Date('2025-09-01'),
        size: '2.5 MB',
        description: 'Introduction to HTML5 semantic elements and CSS3 styling.',
      },
      {
        id: '2',
        courseId: 'CS301',
        title: 'JavaScript Fundamentals',
        type: 'video',
        url: '/videos/cs301-js-basics',
        uploadedDate: new Date('2025-09-08'),
        size: '125 MB',
        description: 'Video tutorial covering JavaScript basics and DOM manipulation.',
      },
      {
        id: '3',
        courseId: 'CS302',
        title: 'SQL Tutorial',
        type: 'link',
        url: 'https://sql-tutorial.example.com',
        uploadedDate: new Date('2025-09-05'),
        description: 'Interactive SQL tutorial with practice exercises.',
      },
    ];

    const mockStatistics: CourseStatistics = {
      totalCourses: mockCourses.length,
      ongoingCourses: mockCourses.filter(c => c.status === 'ongoing').length,
      completedCourses: mockCourses.filter(c => c.status === 'completed').length,
      upcomingCourses: mockCourses.filter(c => c.status === 'upcoming').length,
      totalCredits: mockCourses.reduce((sum, c) => sum + c.credits, 0),
      currentCredits: mockCourses.filter(c => c.status === 'ongoing').reduce((sum, c) => sum + c.credits, 0),
      averageGrade: 3.67,
      overallProgress: 68.5,
      favoriteCourses: ['CS301', 'MATH201'],
      departments: [...new Set(mockCourses.map(c => c.department))],
    };

    setCourses(mockCourses);
    setResources(mockResources);
    setStatistics(mockStatistics);
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
        <p className="text-muted-foreground">Unable to load courses information</p>
      </div>
    );
  }

  const getStatusColor = (status: Course['status']) => {
    const colors = {
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      upcoming: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status];
  };

  const getDifficultyColor = (difficulty: Course['difficulty']) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return colors[difficulty];
  };

  const getTypeIcon = (type: Course['type']) => {
    const icons = {
      lecture: BookOpen,
      lab: Target,
      seminar: Users,
      online: Play,
    };
    return icons[type];
  };

  const getTypeColor = (type: Course['type']) => {
    const colors = {
      lecture: 'text-blue-600',
      lab: 'text-purple-600',
      seminar: 'text-orange-600',
      online: 'text-green-600',
    };
    return colors[type];
  };

  const getResourceIcon = (type: CourseResource['type']) => {
    const icons = {
      lecture: FileText,
      assignment: Target,
      reading: BookOpen,
      video: Play,
      link: ExternalLink,
    };
    return icons[type];
  };

  const getDaysUntilNextClass = (nextClass: Date) => {
    const today = new Date();
    const diffTime = nextClass.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredCourses = courses.filter(course => {
    const matchesDepartment = selectedDepartment === 'all' || course.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesStatus && matchesSearch;
  });

  const ongoingCourses = filteredCourses.filter(c => c.status === 'ongoing');
  const completedCourses = filteredCourses.filter(c => c.status === 'completed');
  const upcomingCourses = filteredCourses.filter(c => c.status === 'upcoming');

  return (
    <div className="space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground">
            Manage your courses and access learning materials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Schedule
          </Button>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.ongoingCourses}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.currentCredits} credit hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.completedCourses}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.totalCredits - statistics.currentCredits} credits earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.averageGrade?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              GPA this semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.overallProgress.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Program completion
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
              variant={viewMode === 'schedule' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('schedule')}
            >
              Schedule
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
          <span className="text-sm font-medium">Department:</span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-1 border border-border rounded-md bg-card text-foreground text-sm"
          >
            <option value="all">All Departments</option>
            {statistics.departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1 border border-border rounded-md bg-card text-foreground text-sm"
          >
            <option value="all">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
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
          {/* Current Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Current Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {ongoingCourses.map((course) => {
                  const TypeIcon = getTypeIcon(course.type);
                  const daysUntilNext = course.nextClass ? getDaysUntilNextClass(course.nextClass) : null;
                  
                  return (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(course.type)} bg-opacity-10`}>
                            <TypeIcon className={`h-5 w-5 ${getTypeColor(course.type)}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{course.code}</h3>
                              <Badge className={getStatusColor(course.status)} variant="outline">
                                {course.status}
                              </Badge>
                              <Badge className={getDifficultyColor(course.difficulty)} variant="outline">
                                {course.difficulty}
                              </Badge>
                              {statistics.favoriteCourses.includes(course.code) && (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <h4 className="font-medium text-sm mb-1">{course.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {course.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {course.instructor}
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                {course.credits} credits
                              </span>
                              {course.rating && (
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  {course.rating.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Attendance:</span>
                            <span className="ml-2 font-medium">{course.attendance}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Assignments:</span>
                            <span className="ml-2 font-medium">
                              {course.assignments.completed}/{course.assignments.total}
                            </span>
                          </div>
                        </div>

                        {course.nextClass && (
                          <div className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>Next class: {course.nextClass.toLocaleDateString()}</span>
                            </div>
                            <div className="text-sm font-medium">
                              {daysUntilNext !== null && (
                                <span>
                                  {daysUntilNext === 0 ? 'Today' :
                                   daysUntilNext === 1 ? 'Tomorrow' :
                                   `${daysUntilNext} days`}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {course.announcements > 0 && (
                              <div className="flex items-center gap-1 text-xs text-orange-600">
                                <Bell className="h-3 w-3" />
                                {course.announcements} new
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button size="sm">
                              Open Course
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="h-5 w-5" />
                Recent Course Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources.slice(0, 5).map((resource) => {
                  const Icon = getResourceIcon(resource.type);
                  const course = courses.find(c => c.id === resource.courseId);
                  
                  return (
                    <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{resource.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {course?.code} • {resource.uploadedDate.toLocaleDateString()}
                          </p>
                          {resource.size && (
                            <p className="text-xs text-muted-foreground">{resource.size}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {resource.url && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open
                          </Button>
                        )}
                        {resource.downloadUrl && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
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

      {viewMode === 'schedule' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Course Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ongoingCourses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold">{course.code}</h3>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm">{course.title}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {course.schedule.map((session, index) => (
                      <div key={`${course.id}-${session.dayOfWeek}-${session.startTime}`} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Day</div>
                          <div className="font-medium">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][session.dayOfWeek]}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Time</div>
                          <div className="font-medium">{session.startTime} - {session.endTime}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Room</div>
                          <div className="font-medium">{session.room}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'detailed' && (
        <div className="space-y-6">
          {/* Ongoing Courses */}
          {ongoingCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Ongoing Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ongoingCourses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{course.code}</h3>
                            <Badge className={getStatusColor(course.status)}>
                              {course.status}
                            </Badge>
                            <Badge className={getDifficultyColor(course.difficulty)} variant="outline">
                              {course.difficulty}
                            </Badge>
                          </div>
                          <h4 className="font-medium mb-2">{course.title}</h4>
                          <p className="text-muted-foreground mb-3">{course.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Instructor:</span>
                              <p className="font-medium">{course.instructor}</p>
                              <p className="text-xs text-muted-foreground">{course.instructorEmail}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Credits:</span>
                              <p className="font-medium">{course.credits}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Department:</span>
                              <p className="font-medium">{course.department}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Faculty:</span>
                              <p className="font-medium">{course.faculty}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {course.rating && (
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">{course.rating.toFixed(1)}</span>
                            </div>
                          )}
                          {course.currentGrade && (
                            <Badge className="bg-green-100 text-green-800">
                              Grade: {course.currentGrade}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Attendance</span>
                            <span>{course.attendance}%</span>
                          </div>
                          <Progress value={course.attendance} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Assignments</span>
                            <span>{course.assignments.completed}/{course.assignments.total}</span>
                          </div>
                          <Progress value={(course.assignments.completed / course.assignments.total) * 100} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Prerequisites: {course.prerequisites.join(', ') || 'None'}</span>
                          {course.announcements > 0 && (
                            <span className="flex items-center gap-1 text-orange-600">
                              <Bell className="h-3 w-3" />
                              {course.announcements} announcements
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact Instructor
                          </Button>
                          <Button size="sm">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Open Course
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Courses */}
          {completedCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Completed Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{course.code}</h3>
                        <p className="text-sm text-muted-foreground">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.instructor} • {course.credits} credits</p>
                      </div>
                      <div className="text-right">
                        {course.currentGrade && (
                          <Badge className="bg-green-100 text-green-800 mb-2">
                            {course.currentGrade}
                          </Badge>
                        )}
                        <p className="text-sm text-muted-foreground">Completed {course.semester}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}