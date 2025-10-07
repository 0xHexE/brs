import React from 'react';
import type { CourseCalendarOutput, Course, CalendarEvent } from '@/types/course-calendar';
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, BookOpenIcon } from 'lucide-react';

interface CourseCalendarWidgetProps {
  calendarData: CourseCalendarOutput;
}

export const CourseCalendarWidget: React.FC<CourseCalendarWidgetProps> = ({ calendarData }) => {
  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class':
        return <BookOpenIcon className="size-4" />;
      case 'exam':
        return <CalendarIcon className="size-4 text-red-500" />;
      case 'assignment':
        return <CalendarIcon className="size-4 text-orange-500" />;
      case 'holiday':
        return <CalendarIcon className="size-4 text-green-500" />;
      default:
        return <CalendarIcon className="size-4" />;
    }
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'assignment':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'holiday':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const upcomingEvents = calendarData.events
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Course Calendar</h3>
            <p className="text-indigo-100">
              {new Date(calendarData.year, calendarData.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <p className="text-indigo-200 text-sm mt-1">
              {calendarData.semester} • Student ID: {calendarData.studentId}
            </p>
          </div>
          <CalendarIcon className="size-12 text-indigo-200" />
        </div>
      </div>

      <div className="p-6">
        {/* Courses Grid */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpenIcon className="size-5 mr-2 text-indigo-600" />
            Enrolled Courses
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calendarData.courses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{ borderLeftColor: course.color, borderLeftWidth: '4px' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-gray-900">{course.code}</h5>
                    <p className="text-gray-600 text-sm">{course.name}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {course.credits} credits
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <UserIcon className="size-4 mr-2 text-gray-400" />
                    {course.instructor}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="size-4 mr-2 text-gray-400" />
                    {course.schedule.days.join(', ')} {course.schedule.time}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="size-4 mr-2 text-gray-400" />
                    {course.schedule.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarIcon className="size-5 mr-2 text-indigo-600" />
            Upcoming Events
          </h4>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${getEventColor(
                    event.type
                  )}`}
                >
                  <div className="flex items-center space-x-3">
                    {getEventIcon(event.type)}
                    <div>
                      <p className="font-medium">{event.title}</p>
                      {event.courseCode && (
                        <p className="text-sm opacity-75">{event.courseCode}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{event.date}</p>
                    <p className="text-xs opacity-75">{event.time}</p>
                    {event.location && (
                      <p className="text-xs opacity-75 flex items-center justify-end mt-1">
                        <MapPinIcon className="size-3 mr-1" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No upcoming events scheduled
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Last updated: {calendarData.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
};