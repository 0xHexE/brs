'use client';

import {
  Calendar,
  Clock,
  Download,
  FileText,
  Filter,
  Upload,
  AlertCircle,
  CheckCircle,
  BookOpen,
  User,
  TrendingUp,
  BarChart3,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Paperclip,
  MessageSquare,
  Star,
  Target,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthUser } from '@/hooks/use-auth-user';

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  dueDate: Date;
  assignedDate: Date;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  type: 'homework' | 'project' | 'quiz' | 'exam' | 'lab' | 'essay';
  maxPoints: number;
  earnedPoints?: number;
  percentage?: number;
  weight: number;
  submissions: number;
  maxSubmissions: number;
  hasAttachments: boolean;
  feedback?: string;
  grade?: string;
  estimatedTime: number; // in hours
  tags: string[];
}

interface CourseAssignment {
  courseCode: string;
  courseTitle: string;
  instructor: string;
  assignments: Assignment[];
  overallGrade?: number;
  upcomingAssignments: number;
  completedAssignments: number;
}

interface AssignmentStatistics {
  totalAssignments: number;
  submittedAssignments: number;
  pendingAssignments: number;
  overdueAssignments: number;
  gradedAssignments: number;
  averageScore: number;
  onTimeSubmissionRate: number;
  totalEstimatedHours: number;
  completedHours: number;
}

export default function AssignmentsPage() {
  const { user, loading } = useAuthUser();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courseAssignments, setCourseAssignments] = useState<CourseAssignment[]>([]);
  const [statistics, setStatistics] = useState<AssignmentStatistics | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'calendar' | 'detailed'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock assignments data - in real app, this would come from API
    const mockAssignments: Assignment[] = [
      {
        id: '1',
        title: 'Web Development Portfolio',
        description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript. Include at least 5 different pages with navigation.',
        courseCode: 'CS301',
        courseTitle: 'Web Development',
        instructor: 'Dr. Emily Davis',
        dueDate: new Date('2025-10-12'),
        assignedDate: new Date('2025-09-28'),
        status: 'pending',
        priority: 'high',
        type: 'project',
        maxPoints: 100,
        weight: 20,
        submissions: 0,
        maxSubmissions: 3,
        hasAttachments: true,
        estimatedTime: 12,
        tags: ['html', 'css', 'javascript', 'responsive'],
      },
      {
        id: '2',
        title: 'Database Design ER Diagram',
        description: 'Design an Entity-Relationship diagram for a university management system. Include all entities, relationships, and attributes.',
        courseCode: 'CS302',
        courseTitle: 'Database Systems',
        instructor: 'Dr. Robert Wilson',
        dueDate: new Date('2025-10-08'),
        assignedDate: new Date('2025-09-24'),
        status: 'submitted',
        priority: 'medium',
        type: 'homework',
        maxPoints: 50,
        earnedPoints: 45,
        percentage: 90,
        weight: 10,
        submissions: 1,
        maxSubmissions: 2,
        hasAttachments: true,
        feedback: 'Good design! Consider adding more normalization details.',
        grade: 'A-',
        estimatedTime: 6,
        tags: ['database', 'er-diagram', 'design'],
      },
      {
        id: '3',
        title: 'Algorithm Analysis Report',
        description: 'Analyze the time and space complexity of sorting algorithms. Include theoretical analysis and empirical results.',
        courseCode: 'CS201',
        courseTitle: 'Data Structures & Algorithms',
        instructor: 'Prof. Michael Chen',
        dueDate: new Date('2025-10-05'),
        assignedDate: new Date('2025-09-20'),
        status: 'overdue',
        priority: 'high',
        type: 'essay',
        maxPoints: 75,
        weight: 15,
        submissions: 0,
        maxSubmissions: 1,
        hasAttachments: false,
        estimatedTime: 8,
        tags: ['algorithms', 'complexity', 'analysis'],
      },
      {
        id: '4',
        title: 'Logic Proofs Assignment',
        description: 'Complete 10 mathematical logic proofs using different inference rules.',
        courseCode: 'MATH201',
        courseTitle: 'Discrete Mathematics',
        instructor: 'Dr. Sarah Johnson',
        dueDate: new Date('2025-10-15'),
        assignedDate: new Date('2025-10-01'),
        status: 'pending',
        priority: 'medium',
        type: 'homework',
        maxPoints: 100,
        weight: 15,
        submissions: 0,
        maxSubmissions: 2,
        hasAttachments: true,
        estimatedTime: 10,
        tags: ['logic', 'proofs', 'mathematics'],
      },
      {
        id: '5',
        title: 'JavaScript Quiz 2',
        description: 'Online quiz covering JavaScript functions, arrays, and objects.',
        courseCode: 'CS301',
        courseTitle: 'Web Development',
        instructor: 'Dr. Emily Davis',
        dueDate: new Date('2025-10-10'),
        assignedDate: new Date('2025-10-03'),
        status: 'pending',
        priority: 'low',
        type: 'quiz',
        maxPoints: 25,
        weight: 5,
        submissions: 0,
        maxSubmissions: 1,
        hasAttachments: false,
        estimatedTime: 1,
        tags: ['javascript', 'quiz', 'online'],
      },
      {
        id: '6',
        title: 'Research Paper Draft',
        description: 'Submit first draft of research paper on artificial intelligence ethics. Minimum 1500 words.',
        courseCode: 'ENG101',
        courseTitle: 'Academic Writing',
        instructor: 'Dr. James Miller',
        dueDate: new Date('2025-10-20'),
        assignedDate: new Date('2025-09-15'),
        status: 'pending',
        priority: 'medium',
        type: 'essay',
        maxPoints: 100,
        weight: 25,
        submissions: 0,
        maxSubmissions: 3,
        hasAttachments: true,
        estimatedTime: 15,
        tags: ['research', 'writing', 'ai-ethics'],
      },
      {
        id: '7',
        title: 'Lab 3: SQL Queries',
        description: 'Write complex SQL queries for data manipulation and retrieval.',
        courseCode: 'CS302',
        courseTitle: 'Database Systems',
        instructor: 'Dr. Robert Wilson',
        dueDate: new Date('2025-09-30'),
        assignedDate: new Date('2025-09-16'),
        status: 'graded',
        priority: 'medium',
        type: 'lab',
        maxPoints: 40,
        earnedPoints: 38,
        percentage: 95,
        weight: 8,
        submissions: 2,
        maxSubmissions: 3,
        hasAttachments: true,
        feedback: 'Excellent work! All queries were optimized correctly.',
        grade: 'A',
        estimatedTime: 4,
        tags: ['sql', 'database', 'lab'],
      },
    ];

    const mockCourseAssignments: CourseAssignment[] = [
      {
        courseCode: 'CS301',
        courseTitle: 'Web Development',
        instructor: 'Dr. Emily Davis',
        assignments: mockAssignments.filter(a => a.courseCode === 'CS301'),
        upcomingAssignments: 2,
        completedAssignments: 3,
      },
      {
        courseCode: 'CS302',
        courseTitle: 'Database Systems',
        instructor: 'Dr. Robert Wilson',
        assignments: mockAssignments.filter(a => a.courseCode === 'CS302'),
        upcomingAssignments: 1,
        completedAssignments: 4,
      },
      {
        courseCode: 'CS201',
        courseTitle: 'Data Structures & Algorithms',
        instructor: 'Prof. Michael Chen',
        assignments: mockAssignments.filter(a => a.courseCode === 'CS201'),
        upcomingAssignments: 0,
        completedAssignments: 5,
      },
      {
        courseCode: 'MATH201',
        courseTitle: 'Discrete Mathematics',
        instructor: 'Dr. Sarah Johnson',
        assignments: mockAssignments.filter(a => a.courseCode === 'MATH201'),
        upcomingAssignments: 1,
        completedAssignments: 3,
      },
      {
        courseCode: 'ENG101',
        courseTitle: 'Academic Writing',
        instructor: 'Dr. James Miller',
        assignments: mockAssignments.filter(a => a.courseCode === 'ENG101'),
        upcomingAssignments: 1,
        completedAssignments: 2,
      },
    ];

    const mockStatistics: AssignmentStatistics = {
      totalAssignments: mockAssignments.length,
      submittedAssignments: mockAssignments.filter(a => a.status === 'submitted' || a.status === 'graded').length,
      pendingAssignments: mockAssignments.filter(a => a.status === 'pending').length,
      overdueAssignments: mockAssignments.filter(a => a.status === 'overdue').length,
      gradedAssignments: mockAssignments.filter(a => a.status === 'graded').length,
      averageScore: mockAssignments.filter(a => a.percentage).reduce((sum, a) => sum + (a.percentage || 0), 0) / mockAssignments.filter(a => a.percentage).length,
      onTimeSubmissionRate: 85.5,
      totalEstimatedHours: mockAssignments.reduce((sum, a) => sum + a.estimatedTime, 0),
      completedHours: mockAssignments.filter(a => a.status === 'graded').reduce((sum, a) => sum + a.estimatedTime, 0),
    };

    setAssignments(mockAssignments);
    setCourseAssignments(mockCourseAssignments);
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
        <p className="text-muted-foreground">Unable to load assignments information</p>
      </div>
    );
  }

  const getStatusColor = (status: Assignment['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      submitted: 'bg-blue-100 text-blue-800',
      graded: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Assignment['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[priority];
  };

  const getTypeIcon = (type: Assignment['type']) => {
    const icons = {
      homework: FileText,
      project: Target,
      quiz: CheckCircle,
      exam: AlertCircle,
      lab: Zap,
      essay: BookOpen,
    };
    return icons[type];
  };

  const getTypeColor = (type: Assignment['type']) => {
    const colors = {
      homework: 'text-blue-600',
      project: 'text-purple-600',
      quiz: 'text-green-600',
      exam: 'text-red-600',
      lab: 'text-orange-600',
      essay: 'text-indigo-600',
    };
    return colors[type];
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateColor = (dueDate: Date) => {
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return 'text-red-600';
    if (daysUntil <= 2) return 'text-orange-600';
    if (daysUntil <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesCourse = selectedCourse === 'all' || assignment.courseCode === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesStatus && matchesSearch;
  });

  const upcomingAssignments = filteredAssignments.filter(a => a.status === 'pending' || a.status === 'overdue');
  const recentSubmissions = filteredAssignments.filter(a => a.status === 'submitted' || a.status === 'graded').slice(-5);

  return (
    <div className="space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">
            Manage and track your assignments and submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Assignment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.overdueAssignments} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.submittedAssignments}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.gradedAssignments} graded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {statistics.onTimeSubmissionRate}% on-time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workload</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalEstimatedHours}h</div>
            <p className="text-xs text-muted-foreground">
              {statistics.completedHours}h completed
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
            {courseAssignments.map(course => (
              <option key={course.courseCode} value={course.courseCode}>
                {course.courseCode} - {course.courseTitle}
              </option>
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
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {viewMode === 'overview' && (
        <>
          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssignments.slice(0, 5).map((assignment) => {
                  const Icon = getTypeIcon(assignment.type);
                  const daysUntil = getDaysUntilDue(assignment.dueDate);
                  
                  return (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${getTypeColor(assignment.type)} bg-opacity-10`}>
                          <Icon className={`h-5 w-5 ${getTypeColor(assignment.type)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{assignment.title}</h3>
                            <Badge className={getPriorityColor(assignment.priority)} variant="outline">
                              {assignment.priority}
                            </Badge>
                            {assignment.hasAttachments && (
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {assignment.courseCode} - {assignment.courseTitle}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {assignment.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {assignment.maxPoints} points
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {assignment.estimatedTime}h estimated
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getDueDateColor(assignment.dueDate)}`}>
                          {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : 
                           daysUntil === 0 ? 'Due today' :
                           daysUntil === 1 ? 'Due tomorrow' :
                           `${daysUntil} days`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {assignment.dueDate.toLocaleDateString()}
                        </div>
                        <div className="mt-2">
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Course Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Assignments by Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseAssignments.map((course) => (
                    <div key={course.courseCode} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{course.courseCode}</h4>
                        <p className="text-sm text-muted-foreground">{course.courseTitle}</p>
                        <p className="text-xs text-muted-foreground">{course.instructor}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-600">{course.completedAssignments} completed</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-orange-600">{course.upcomingAssignments} upcoming</span>
                        </div>
                        <Progress 
                          value={(course.completedAssignments / (course.completedAssignments + course.upcomingAssignments)) * 100} 
                          className="w-20 mt-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSubmissions.map((assignment) => {
                    const Icon = getTypeIcon(assignment.type);
                    return (
                      <div key={assignment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className={`p-2 rounded-lg ${getTypeColor(assignment.type)} bg-opacity-10`}>
                          <Icon className={`h-4 w-4 ${getTypeColor(assignment.type)}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{assignment.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {assignment.courseCode} • {assignment.status === 'graded' ? 'Graded' : 'Submitted'}
                          </p>
                        </div>
                        <div className="text-right">
                          {assignment.percentage && (
                            <p className="font-medium text-sm">{assignment.percentage}%</p>
                          )}
                          {assignment.grade && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {assignment.grade}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Assignment Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Calendar view will be implemented with a full calendar component</p>
              <p className="text-sm">Showing assignment due dates and submission deadlines</p>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'detailed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => {
                const Icon = getTypeIcon(assignment.type);
                const daysUntil = getDaysUntilDue(assignment.dueDate);
                
                return (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${getTypeColor(assignment.type)} bg-opacity-10`}>
                          <Icon className={`h-5 w-5 ${getTypeColor(assignment.type)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{assignment.title}</h3>
                            <Badge className={getPriorityColor(assignment.priority)} variant="outline">
                              {assignment.priority}
                            </Badge>
                            <Badge className={getStatusColor(assignment.status)}>
                              {assignment.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {assignment.courseCode} - {assignment.courseTitle}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {assignment.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {assignment.maxPoints} points ({assignment.weight}%)
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {assignment.estimatedTime}h estimated
                            </span>
                          </div>
                          {assignment.tags.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              {assignment.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getDueDateColor(assignment.dueDate)}`}>
                          {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : 
                           daysUntil === 0 ? 'Due today' :
                           daysUntil === 1 ? 'Due tomorrow' :
                           `${daysUntil} days`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {assignment.dueDate.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Assigned: {assignment.assignedDate.toLocaleDateString()}
                        </div>
                        {assignment.hasAttachments && (
                          <div className="mt-2">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>

                    {assignment.feedback && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">Instructor Feedback</span>
                        </div>
                        <p className="text-sm text-blue-800">{assignment.feedback}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Submissions: {assignment.submissions}/{assignment.maxSubmissions}
                        </span>
                        {assignment.percentage && (
                          <span className="text-sm text-muted-foreground">
                            • Score: {assignment.earnedPoints}/{assignment.maxPoints} ({assignment.percentage}%)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {assignment.status === 'pending' && (
                          <Button size="sm">
                            <Upload className="h-4 w-4 mr-1" />
                            Submit
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