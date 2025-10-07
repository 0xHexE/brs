'use client';

import {
  Award,
  BookOpen,
  Calendar,
  ChartBar,
  Download,
  Filter,
  GraduationCap,
  Mail,
  TrendingDown,
  TrendingUp,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuthUser } from '@/hooks/use-auth-user';

interface CourseGrade {
  id: string;
  code: string;
  title: string;
  creditHours: number;
  semester: string;
  lecturer: string;
  grade: string;
  gradePoints: number;
  attendance: number;
  status: 'completed' | 'ongoing' | 'upcoming';
  assignments: AssignmentGrade[];
  midterm?: number;
  final?: number;
  project?: number;
  participation?: number;
}

interface AssignmentGrade {
  id: string;
  title: string;
  maxPoints: number;
  earnedPoints: number;
  percentage: number;
  weight: number;
  dueDate: Date;
  submittedDate?: Date;
  feedback?: string;
}

interface SemesterGPA {
  semester: string;
  gpa: number;
  creditHours: number;
  qualityPoints: number;
  courses: number;
}

interface GradeStatistics {
  currentGPA: number;
  cumulativeGPA: number;
  totalCreditHours: number;
  qualityPoints: number;
  classRank?: string;
  majorRank?: string;
  deanList: boolean;
  academicStanding: 'excellent' | 'good' | 'satisfactory' | 'probation';
}

export default function GradesPage() {
  const { user, loading } = useAuthUser();
  const [courseGrades, setCourseGrades] = useState<CourseGrade[]>([]);
  const [semesterGPAs, setSemesterGPAs] = useState<SemesterGPA[]>([]);
  const [statistics, setStatistics] = useState<GradeStatistics | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'analytics'>('overview');

  useEffect(() => {
    // Mock grades data - in real app, this would come from API
    const mockCourseGrades: CourseGrade[] = [
      {
        id: '1',
        code: 'CS301',
        title: 'Web Development',
        creditHours: 3,
        semester: 'Fall 2025',
        lecturer: 'Dr. Emily Davis',
        grade: 'A-',
        gradePoints: 3.7,
        attendance: 92,
        status: 'ongoing',
        assignments: [
          {
            id: '1',
            title: 'HTML/CSS Portfolio',
            maxPoints: 100,
            earnedPoints: 95,
            percentage: 95,
            weight: 15,
            dueDate: new Date('2025-09-15'),
            submittedDate: new Date('2025-09-14'),
            feedback: 'Excellent work on responsive design!',
          },
          {
            id: '2',
            title: 'JavaScript Project',
            maxPoints: 100,
            earnedPoints: 88,
            percentage: 88,
            weight: 20,
            dueDate: new Date('2025-10-01'),
            submittedDate: new Date('2025-09-30'),
          },
        ],
        midterm: 85,
        project: 92,
        participation: 90,
      },
      {
        id: '2',
        code: 'CS302',
        title: 'Database Systems',
        creditHours: 3,
        semester: 'Fall 2025',
        lecturer: 'Dr. Robert Wilson',
        grade: 'B+',
        gradePoints: 3.3,
        attendance: 88,
        status: 'ongoing',
        assignments: [
          {
            id: '3',
            title: 'Database Design',
            maxPoints: 100,
            earnedPoints: 82,
            percentage: 82,
            weight: 15,
            dueDate: new Date('2025-09-20'),
            submittedDate: new Date('2025-09-19'),
          },
        ],
        midterm: 78,
        participation: 85,
      },
      {
        id: '3',
        code: 'CS201',
        title: 'Data Structures & Algorithms',
        creditHours: 4,
        semester: 'Spring 2025',
        lecturer: 'Prof. Michael Chen',
        grade: 'B+',
        gradePoints: 3.3,
        attendance: 95,
        status: 'completed',
        assignments: [
          {
            id: '4',
            title: 'Linked Lists Implementation',
            maxPoints: 100,
            earnedPoints: 90,
            percentage: 90,
            weight: 10,
            dueDate: new Date('2025-02-15'),
            submittedDate: new Date('2025-02-14'),
          },
          {
            id: '5',
            title: 'Sorting Algorithms',
            maxPoints: 100,
            earnedPoints: 85,
            percentage: 85,
            weight: 15,
            dueDate: new Date('2025-03-01'),
            submittedDate: new Date('2025-02-28'),
          },
        ],
        midterm: 82,
        final: 88,
        project: 86,
        participation: 92,
      },
      {
        id: '4',
        code: 'MATH201',
        title: 'Discrete Mathematics',
        creditHours: 3,
        semester: 'Fall 2025',
        lecturer: 'Dr. Sarah Johnson',
        grade: 'A',
        gradePoints: 4.0,
        attendance: 96,
        status: 'ongoing',
        assignments: [
          {
            id: '6',
            title: 'Logic Proofs',
            maxPoints: 100,
            earnedPoints: 98,
            percentage: 98,
            weight: 20,
            dueDate: new Date('2025-09-25'),
            submittedDate: new Date('2025-09-24'),
          },
        ],
        midterm: 94,
        participation: 95,
      },
      {
        id: '5',
        code: 'ENG101',
        title: 'Academic Writing',
        creditHours: 2,
        semester: 'Spring 2025',
        lecturer: 'Dr. James Miller',
        grade: 'A-',
        gradePoints: 3.7,
        attendance: 98,
        status: 'completed',
        assignments: [
          {
            id: '7',
            title: 'Research Paper',
            maxPoints: 100,
            earnedPoints: 92,
            percentage: 92,
            weight: 25,
            dueDate: new Date('2025-04-01'),
            submittedDate: new Date('2025-03-31'),
          },
        ],
        midterm: 89,
        final: 91,
        participation: 94,
      },
    ];

    const mockSemesterGPAs: SemesterGPA[] = [
      {
        semester: 'Fall 2025',
        gpa: 3.5,
        creditHours: 9,
        qualityPoints: 31.5,
        courses: 3,
      },
      {
        semester: 'Spring 2025',
        gpa: 3.47,
        creditHours: 6,
        qualityPoints: 20.8,
        courses: 2,
      },
      {
        semester: 'Fall 2024',
        gpa: 3.67,
        creditHours: 12,
        qualityPoints: 44.0,
        courses: 4,
      },
      {
        semester: 'Spring 2024',
        gpa: 3.8,
        creditHours: 15,
        qualityPoints: 57.0,
        courses: 5,
      },
    ];

    const mockStatistics: GradeStatistics = {
      currentGPA: 3.5,
      cumulativeGPA: 3.61,
      totalCreditHours: 42,
      qualityPoints: 151.6,
      classRank: '15/120',
      majorRank: '8/85',
      deanList: true,
      academicStanding: 'excellent',
    };

    setCourseGrades(mockCourseGrades);
    setSemesterGPAs(mockSemesterGPAs);
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
        <p className="text-muted-foreground">Unable to load grades information</p>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
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

  const getAssignmentColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAcademicStandingColor = (standing: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      satisfactory: 'bg-yellow-100 text-yellow-800',
      probation: 'bg-red-100 text-red-800',
    };
    return colors[standing as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredCourses = selectedSemester === 'all' 
    ? courseGrades 
    : courseGrades.filter(course => course.semester === selectedSemester);

  const completedCourses = courseGrades.filter(course => course.status === 'completed');
  const ongoingCourses = courseGrades.filter(course => course.status === 'ongoing');

  return (
    <div className="space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Academic Grades</h1>
          <p className="text-muted-foreground">
            Track your academic performance and grades
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Transcript
          </Button>
        </div>
      </div>

      {/* Academic Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.currentGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Fall 2025
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumulative GPA</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.cumulativeGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.totalCreditHours} credit hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.classRank}</div>
            <p className="text-xs text-muted-foreground">
              Major: {statistics.majorRank}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Standing</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={getAcademicStandingColor(statistics.academicStanding)}>
                {statistics.academicStanding}
              </Badge>
              {statistics.deanList && (
                <Badge className="bg-green-100 text-green-800">Dean's List</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Selector */}
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
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('detailed')}
            >
              Detailed
            </Button>
            <Button
              variant={viewMode === 'analytics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('analytics')}
            >
              Analytics
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Semester:</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-1 border border-border rounded-md bg-card text-foreground text-sm"
          >
            <option value="all">All Semesters</option>
            <option value="Fall 2025">Fall 2025</option>
            <option value="Spring 2025">Spring 2025</option>
            <option value="Fall 2024">Fall 2024</option>
            <option value="Spring 2024">Spring 2024</option>
          </select>
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
              <div className="space-y-4">
                {ongoingCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{course.code}</h3>
                        <Badge variant="outline">{course.creditHours} credits</Badge>
                        <Badge className={getGradeColor(course.grade)}>
                          {course.grade}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{course.title}</p>
                      <p className="text-xs text-muted-foreground">Instructor: {course.lecturer}</p>
                    </div>
                    <div className="text-right">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Grade Points:</span>
                          <span className="text-sm font-medium">{course.gradePoints.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Attendance:</span>
                          <span className="text-sm font-medium">{course.attendance}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Semester GPA Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Semester GPA Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {semesterGPAs.map((semester, index) => (
                    <div key={semester.semester} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{semester.semester}</p>
                        <p className="text-sm text-muted-foreground">
                          {semester.courses} courses • {semester.creditHours} credits
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{semester.gpa.toFixed(2)}</p>
                        {index > 0 && (
                          <p className={`text-xs flex items-center gap-1 ${
                            semester.gpa > semesterGPAs[index - 1].gpa 
                              ? 'text-green-600' 
                              : semester.gpa < semesterGPAs[index - 1].gpa 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                          }`}>
                            {semester.gpa > semesterGPAs[index - 1].gpa && <TrendingUp className="h-3 w-3" />}
                            {semester.gpa < semesterGPAs[index - 1].gpa && <TrendingDown className="h-3 w-3" />}
                            {Math.abs(semester.gpa - semesterGPAs[index - 1].gpa).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Dean's List</p>
                      <p className="text-xs text-muted-foreground">Fall 2024, Spring 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Top 10% in Major</p>
                      <p className="text-xs text-muted-foreground">Current standing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-sm">Perfect Attendance</p>
                      <p className="text-xs text-muted-foreground">3 courses this semester</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {viewMode === 'detailed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detailed Course Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{course.code} - {course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.semester} • {course.lecturer} • {course.creditHours} credits
                      </p>
                    </div>
                    <Badge className={getGradeColor(course.grade)} variant="outline">
                      {course.grade} ({course.gradePoints.toFixed(1)})
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Grade Breakdown</h4>
                      <div className="space-y-2">
                        {course.assignments.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Assignments ({course.assignments.reduce((sum, a) => sum + a.weight, 0)}%)</span>
                            <span className="font-medium">
                              {(course.assignments.reduce((sum, a) => sum + (a.percentage * a.weight / 100), 0) / course.assignments.reduce((sum, a) => sum + a.weight, 0) * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                        {course.midterm && (
                          <div className="flex justify-between text-sm">
                            <span>Midterm (30%)</span>
                            <span className="font-medium">{course.midterm}%</span>
                          </div>
                        )}
                        {course.final && (
                          <div className="flex justify-between text-sm">
                            <span>Final (30%)</span>
                            <span className="font-medium">{course.final}%</span>
                          </div>
                        )}
                        {course.project && (
                          <div className="flex justify-between text-sm">
                            <span>Project (20%)</span>
                            <span className="font-medium">{course.project}%</span>
                          </div>
                        )}
                        {course.participation && (
                          <div className="flex justify-between text-sm">
                            <span>Participation (10%)</span>
                            <span className="font-medium">{course.participation}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recent Assignments</h4>
                      <div className="space-y-2">
                        {course.assignments.slice(0, 3).map((assignment) => (
                          <div key={assignment.id} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <p className="font-medium">{assignment.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {assignment.earnedPoints}/{assignment.maxPoints} points
                              </p>
                            </div>
                            <span className={`font-medium ${getAssignmentColor(assignment.percentage)}`}>
                              {assignment.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Grade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['A', 'B', 'C', 'D', 'F'].map((grade) => {
                  const count = completedCourses.filter(c => c.grade.startsWith(grade)).length;
                  const percentage = (count / completedCourses.length) * 100;
                  return (
                    <div key={grade} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-medium">{grade}</span>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Assignment Score</span>
                  <span className="font-semibold">87.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Attendance</span>
                  <span className="font-semibold">92.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">On-time Submission Rate</span>
                  <span className="font-semibold">94.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Courses with A/A-</span>
                  <span className="font-semibold">3 of 5</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Improvement Needed</span>
                  <Badge variant="outline">Database Systems</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}