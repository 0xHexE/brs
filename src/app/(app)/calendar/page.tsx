'use client';

import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'class' | 'assignment' | 'exam' | 'meeting' | 'deadline' | 'event';
  course?: string;
  location?: string;
  instructor?: string;
  color: string;
  priority: 'low' | 'medium' | 'high';
  status?: 'scheduled' | 'completed' | 'cancelled' | 'upcoming';
}

interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  color: string;
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    location: string;
  }[];
}

export default function StudentCalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>(
    'month',
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    type: 'class',
    priority: 'medium',
  });

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Initialize sample data
  useEffect(() => {
    const sampleCourses: Course[] = [
      {
        id: '1',
        name: 'Introduction to Computer Science',
        code: 'CS101',
        instructor: 'Dr. Sarah Johnson',
        color: 'bg-blue-500',
        schedule: [
          {
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '10:30',
            location: 'Room 201',
          },
          {
            dayOfWeek: 3,
            startTime: '09:00',
            endTime: '10:30',
            location: 'Room 201',
          },
          {
            dayOfWeek: 5,
            startTime: '09:00',
            endTime: '10:30',
            location: 'Lab 301',
          },
        ],
      },
      {
        id: '2',
        name: 'Data Structures & Algorithms',
        code: 'CS201',
        instructor: 'Prof. Michael Chen',
        color: 'bg-green-500',
        schedule: [
          {
            dayOfWeek: 2,
            startTime: '11:00',
            endTime: '12:30',
            location: 'Room 305',
          },
          {
            dayOfWeek: 4,
            startTime: '11:00',
            endTime: '12:30',
            location: 'Room 305',
          },
        ],
      },
      {
        id: '3',
        name: 'Web Development',
        code: 'CS301',
        instructor: 'Dr. Emily Davis',
        color: 'bg-purple-500',
        schedule: [
          {
            dayOfWeek: 1,
            startTime: '14:00',
            endTime: '15:30',
            location: 'Lab 401',
          },
          {
            dayOfWeek: 3,
            startTime: '14:00',
            endTime: '15:30',
            location: 'Lab 401',
          },
        ],
      },
      {
        id: '4',
        name: 'Database Systems',
        code: 'CS302',
        instructor: 'Dr. Robert Wilson',
        color: 'bg-orange-500',
        schedule: [
          {
            dayOfWeek: 2,
            startTime: '14:00',
            endTime: '15:30',
            location: 'Room 202',
          },
          {
            dayOfWeek: 4,
            startTime: '14:00',
            endTime: '15:30',
            location: 'Lab 302',
          },
        ],
      },
    ];

    const sampleEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'CS101 Lecture: Introduction to Programming',
        description: 'Basic concepts of programming and algorithms',
        date: new Date(2025, 9, 6),
        startTime: '09:00',
        endTime: '10:30',
        type: 'class',
        course: 'CS101',
        location: 'Room 201',
        instructor: 'Dr. Sarah Johnson',
        color: 'bg-blue-500',
        priority: 'medium',
        status: 'scheduled',
      },
      {
        id: '2',
        title: 'Assignment 1 Due: Problem Set 1',
        description: 'Complete problems 1-10 from Chapter 1',
        date: new Date(2025, 9, 10),
        startTime: '23:59',
        endTime: '23:59',
        type: 'assignment',
        course: 'CS101',
        color: 'bg-red-500',
        priority: 'high',
        status: 'upcoming',
      },
      {
        id: '3',
        title: 'Midterm Exam',
        description: 'Chapters 1-5, covering basic programming concepts',
        date: new Date(2025, 9, 15),
        startTime: '10:00',
        endTime: '12:00',
        type: 'exam',
        course: 'CS101',
        location: 'Exam Hall A',
        instructor: 'Dr. Sarah Johnson',
        color: 'bg-red-600',
        priority: 'high',
        status: 'upcoming',
      },
      {
        id: '4',
        title: 'CS201 Lab: Data Structures',
        description: 'Implement linked lists and stacks',
        date: new Date(2025, 9, 7),
        startTime: '11:00',
        endTime: '12:30',
        type: 'class',
        course: 'CS201',
        location: 'Lab 301',
        instructor: 'Prof. Michael Chen',
        color: 'bg-green-500',
        priority: 'medium',
        status: 'scheduled',
      },
      {
        id: '5',
        title: 'Project Presentation',
        description: 'Web development project presentations',
        date: new Date(2025, 9, 20),
        startTime: '14:00',
        endTime: '16:00',
        type: 'assignment',
        course: 'CS301',
        location: 'Room 401',
        instructor: 'Dr. Emily Davis',
        color: 'bg-purple-500',
        priority: 'medium',
        status: 'upcoming',
      },
      {
        id: '6',
        title: 'Student Council Meeting',
        description: 'Monthly student council meeting',
        date: new Date(2025, 9, 8),
        startTime: '16:00',
        endTime: '17:00',
        type: 'meeting',
        location: 'Student Lounge',
        color: 'bg-yellow-500',
        priority: 'low',
        status: 'scheduled',
      },
      {
        id: '7',
        title: 'Career Fair 2025',
        description: 'Annual career fair with tech companies',
        date: new Date(2025, 9, 25),
        startTime: '10:00',
        endTime: '15:00',
        type: 'event',
        location: 'Main Auditorium',
        color: 'bg-indigo-500',
        priority: 'medium',
        status: 'upcoming',
      },
    ];

    setCourses(sampleCourses);
    setEvents(sampleEvents);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
      return newDate;
    });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day: number | null) => {
    if (day) {
      const clickedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      setSelectedDate(clickedDate);
      setNewEvent((prev) => ({ ...prev, date: clickedDate }));
    }
  };

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    return events.filter((event) => {
      const eventDate = event.date;
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getFilteredEvents = () => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.course?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedEventType === 'all' || event.type === selectedEventType;
      return matchesSearch && matchesType;
    });
  };

  const getWeekDays = () => {
    const week = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }

    return week;
  };

  const getEventsForTimeSlot = (date: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = event.date;
      const eventHour = parseInt(event.startTime.split(':')[0]);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        eventHour === hour
      );
    });
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let i = 6; i <= 22; i++) {
      slots.push(i);
    }
    return slots;
  };

  const createEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description || '',
        date: newEvent.date,
        startTime: newEvent.startTime || '09:00',
        endTime: newEvent.endTime || '10:00',
        type: newEvent.type || 'class',
        course: newEvent.course,
        location: newEvent.location,
        instructor: newEvent.instructor,
        color: getEventColor(newEvent.type || 'class'),
        priority: newEvent.priority || 'medium',
        status: 'scheduled',
      };

      setEvents((prev) => [...prev, event]);
      setNewEvent({
        title: '',
        date: selectedDate || new Date(),
        startTime: '09:00',
        endTime: '10:00',
        type: 'class',
        priority: 'medium',
      });
      setIsCreateEventOpen(false);
    }
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    const colors = {
      class: 'bg-blue-500',
      assignment: 'bg-orange-500',
      exam: 'bg-red-500',
      meeting: 'bg-green-500',
      deadline: 'bg-purple-500',
      event: 'bg-yellow-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const getEventIcon = (type: CalendarEvent['type']) => {
    const icons = {
      class: BookOpen,
      assignment: FileText,
      exam: Award,
      meeting: Users,
      deadline: AlertCircle,
      event: CalendarIcon,
    };
    return icons[type] || CalendarIcon;
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    const colors = {
      class: 'text-blue-600 bg-blue-50 border-blue-200',
      assignment: 'text-orange-600 bg-orange-50 border-orange-200',
      exam: 'text-red-600 bg-red-50 border-red-200',
      meeting: 'text-green-600 bg-green-50 border-green-200',
      deadline: 'text-purple-600 bg-purple-50 border-purple-200',
      event: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    };
    return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="h-full max-h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  view === 'day'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  view === 'week'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  view === 'month'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('agenda')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  view === 'agenda'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Agenda
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64"
              />
            </div>

            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-card text-foreground"
            >
              <option value="all">All Events</option>
              <option value="class">Classes</option>
              <option value="assignment">Assignments</option>
              <option value="exam">Exams</option>
              <option value="meeting">Meetings</option>
              <option value="deadline">Deadlines</option>
              <option value="event">Events</option>
            </select>

            <button
              onClick={goToToday}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-muted"
            >
              <CalendarIcon className="h-4 w-4" />
              Today
            </button>

            <Dialog
              open={isCreateEventOpen}
              onOpenChange={setIsCreateEventOpen}
            >
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Create Event
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newEvent.title || ''}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="col-span-3"
                      placeholder="Event title"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <select
                      id="type"
                      value={newEvent.type || 'class'}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          type: e.target.value as CalendarEvent['type'],
                        }))
                      }
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="class">Class</option>
                      <option value="assignment">Assignment</option>
                      <option value="exam">Exam</option>
                      <option value="meeting">Meeting</option>
                      <option value="deadline">Deadline</option>
                      <option value="event">Event</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date?.toISOString().split('T')[0] || ''}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          date: new Date(e.target.value),
                        }))
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newEvent.startTime || '09:00'}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEvent.endTime || '10:00'}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={newEvent.location || ''}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="col-span-3"
                      placeholder="Room/Location"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      value={newEvent.description || ''}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="col-span-3 flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Event description"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateEventOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createEvent}>Create Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (view === 'month') navigateMonth('prev');
                else if (view === 'week') navigateWeek('prev');
                else if (view === 'day') navigateDay('prev');
              }}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => {
                if (view === 'month') navigateMonth('next');
                else if (view === 'week') navigateWeek('next');
                else if (view === 'day') navigateDay('next');
              }}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <h2 className="text-xl font-semibold text-foreground ml-2">
              {view === 'month' &&
                `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
              {view === 'week' &&
                `Week of ${getWeekDays()[0].toLocaleDateString()}`}
              {view === 'day' &&
                currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              {view === 'agenda' && 'Agenda View'}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {selectedDate ? (
              <span>
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            ) : (
              <span>Select a date</span>
            )}
          </div>
        </div>
      </div>

      {/* Views */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="flex-1 overflow-auto">
          {/* Month View */}
          {view === 'month' && (
            <div className="p-4">
              <div className="grid grid-cols-7 gap-px bg-border min-h-[600px]">
                {/* Day headers */}
                {daysOfWeek.map((day) => (
                  <div key={day} className="bg-muted p-2 text-center">
                    <span className="text-sm font-medium text-foreground">
                      {day}
                    </span>
                  </div>
                ))}

                {/* Calendar days */}
                {generateCalendarDays().map((day, index) => {
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div
                      key={index}
                      onClick={() => handleDateClick(day)}
                      className={`bg-card p-2 min-h-[120px] cursor-pointer hover:bg-muted transition-colors ${
                        isToday(day)
                          ? 'bg-primary/5 ring-2 ring-primary/20'
                          : ''
                      } ${isSelected(day) ? 'ring-2 ring-primary' : ''}`}
                    >
                      {day && (
                        <>
                          <div
                            className={`text-sm font-medium mb-2 flex items-center justify-between ${
                              isToday(day) ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            <span>{day}</span>
                            {dayEvents.length > 0 && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {dayEvents.length}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event) => {
                              const Icon = getEventIcon(event.type);
                              return (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded ${event.color} text-white truncate flex items-center gap-1`}
                                  title={event.title}
                                >
                                  <Icon className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {event.title}
                                  </span>
                                </div>
                              );
                            })}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-muted-foreground italic">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Week View */}
          {view === 'week' && (
            <div className="p-4">
              <div className="flex h-full">
                <div className="w-20 border-r border-border pr-2 flex-shrink-0">
                  <div className="h-12 border-b border-border"></div>
                  {getTimeSlots().map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-border flex items-start justify-end pr-2"
                    >
                      <span className="text-xs text-muted-foreground">
                        {hour.toString().padStart(2, '0')}:00
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex-1 grid grid-cols-7 gap-px bg-border overflow-x-auto">
                  {getWeekDays().map((date, index) => (
                    <div
                      key={index}
                      className="bg-card flex flex-col min-w-[120px]"
                    >
                      <div
                        className={`h-12 border-b border-border p-2 text-center ${
                          date.toDateString() === new Date().toDateString()
                            ? 'bg-primary/10'
                            : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-foreground">
                          {daysOfWeek[index]}
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            date.toDateString() === new Date().toDateString()
                              ? 'text-primary'
                              : 'text-foreground'
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      </div>

                      {getTimeSlots().map((hour) => {
                        const slotEvents = getEventsForTimeSlot(date, hour);
                        return (
                          <div
                            key={hour}
                            className="h-16 border-b border-border p-1"
                          >
                            {slotEvents.map((event) => {
                              const Icon = getEventIcon(event.type);
                              return (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded ${event.color} text-white truncate flex items-center gap-1`}
                                  title={event.title}
                                >
                                  <Icon className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {event.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Day View */}
          {view === 'day' && (
            <div className="p-4">
              <div className="max-w-4xl mx-auto">
                {getTimeSlots().map((hour) => {
                  const hourEvents = getEventsForTimeSlot(currentDate, hour);
                  return (
                    <div
                      key={hour}
                      className="flex border-b border-border min-h-[80px]"
                    >
                      <div className="w-20 py-2 text-right pr-4">
                        <span className="text-sm text-muted-foreground">
                          {hour.toString().padStart(2, '0')}:00
                        </span>
                      </div>
                      <div className="flex-1 py-2 space-y-2">
                        {hourEvents.map((event) => {
                          const Icon = getEventIcon(event.type);
                          return (
                            <div
                              key={event.id}
                              className={`p-3 rounded-lg ${getEventTypeColor(event.type)} border`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2">
                                  <Icon className="h-4 w-4 mt-0.5" />
                                  <div>
                                    <div className="font-medium text-sm">
                                      {event.title}
                                    </div>
                                    {event.location && (
                                      <div className="text-xs opacity-70 flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" />
                                        {event.location}
                                      </div>
                                    )}
                                    {event.course && (
                                      <div className="text-xs opacity-70 mt-1">
                                        Course: {event.course}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">
                                    {event.startTime} - {event.endTime}
                                  </span>
                                  <button
                                    onClick={() => deleteEvent(event.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Agenda View */}
          {view === 'agenda' && (
            <div className="p-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {filteredEvents
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event, index) => {
                    const Icon = getEventIcon(event.type);
                    return (
                      <Card key={event.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {event.title}
                                </CardTitle>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    {event.date.toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {event.startTime} - {event.endTime}
                                  </div>
                                  {event.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {event.location}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}
                              >
                                {event.type}
                              </span>
                              <button
                                onClick={() => deleteEvent(event.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </CardHeader>
                        {event.description && (
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground">
                              {event.description}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border p-4 overflow-y-auto flex-shrink-0">
          <h3 className="font-semibold text-foreground mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {filteredEvents
              .filter((event) => event.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 10)
              .map((event) => {
                const Icon = getEventIcon(event.type);
                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg bg-muted border border-border"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`p-1 rounded ${getEventTypeColor(event.type)}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {event.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {event.date.toLocaleDateString()} • {event.startTime}
                        </div>
                        {event.location && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <Separator className="my-6" />

          <h3 className="font-semibold text-foreground mb-4">
            Course Schedule
          </h3>
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-3 rounded-lg bg-muted border border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${course.color}`}></div>
                  <div className="font-medium text-sm text-foreground">
                    {course.code}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {course.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {course.instructor}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {course.schedule.map((sched, idx) => (
                    <div key={idx}>
                      {daysOfWeek[sched.dayOfWeek]} • {sched.startTime}-
                      {sched.endTime} • {sched.location}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
