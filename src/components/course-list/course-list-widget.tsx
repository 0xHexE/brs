import React from 'react';
import type { CourseListOutput, CourseInfo } from '@/types/course-list';
import {
  BookOpenIcon,
  UserIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  GraduationCapIcon,
  SearchIcon
} from 'lucide-react';

interface CourseListWidgetProps {
  courseData: CourseListOutput;
}

export const CourseListWidget: React.FC<CourseListWidgetProps> = ({ courseData }) => {
  const getStatusColor = (status: CourseInfo['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'waitlist':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: CourseInfo['level']) => {
    switch (level) {
      case 'undergraduate':
        return 'bg-blue-100 text-blue-800';
      case 'graduate':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnrollmentPercentage = (enrolled: number, capacity: number) => {
    return Math.round((enrolled / capacity) * 100);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Course Catalog</h3>
            <p className="text-teal-100">
              {courseData.totalCount} courses available
            </p>
            {(courseData.filters.department || courseData.filters.level) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {courseData.filters.department && (
                  <span className="bg-teal-600/30 text-teal-100 text-xs px-2 py-1 rounded">
                    Department: {courseData.filters.department}
                  </span>
                )}
                {courseData.filters.level && (
                  <span className="bg-teal-600/30 text-teal-100 text-xs px-2 py-1 rounded">
                    Level: {courseData.filters.level}
                  </span>
                )}
              </div>
            )}
          </div>
          <BookOpenIcon className="size-12 text-teal-200" />
        </div>
      </div>

      <div className="p-6">
        {/* Course List */}
        <div className="space-y-4">
          {courseData.courses.map((course) => (
            <div
              key={course.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {course.code}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  <h5 className="text-gray-800 font-medium mb-2">{course.name}</h5>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-gray-900">{course.credits}</div>
                  <div className="text-xs text-gray-500">credits</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <UserIcon className="size-4 mr-2 text-gray-400" />
                  <span className="truncate">{course.instructor}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="size-4 mr-2 text-gray-400" />
                  <span>{course.schedule.days.join(', ')} {course.schedule.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="size-4 mr-2 text-gray-400" />
                  <span>{course.schedule.room}</span>
                </div>
              </div>

              {/* Prerequisites */}
              {course.prerequisites.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCapIcon className="size-4 mr-2 text-gray-400" />
                    <span>Prerequisites: {course.prerequisites.join(', ')}</span>
                  </div>
                </div>
              )}

              {/* Enrollment Status */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <UsersIcon className="size-4 mr-2 text-gray-400" />
                    <span>
                      {course.enrolled}/{course.capacity} enrolled
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${
                          getEnrollmentPercentage(course.enrolled, course.capacity) >= 90
                            ? 'bg-red-500'
                            : getEnrollmentPercentage(course.enrolled, course.capacity) >= 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${getEnrollmentPercentage(course.enrolled, course.capacity)}%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {getEnrollmentPercentage(course.enrolled, course.capacity)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Department and Semester */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Department: {course.department}</span>
                <span>{course.semester} {course.year}</span>
              </div>
            </div>
          ))}
        </div>

        {/* No courses message */}
        {courseData.courses.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="size-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No courses found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Last updated: {courseData.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
};