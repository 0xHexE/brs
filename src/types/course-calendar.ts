export interface CourseCalendarInput {
  month?: number;
  year?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  schedule: {
    days: string[];
    time: string;
    room: string;
  };
  color: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'class' | 'exam' | 'assignment' | 'holiday';
  courseCode?: string;
  location?: string;
}

export interface CourseCalendarOutput {
  studentId: string;
  month: number;
  year: number;
  semester: string;
  courses: Course[];
  events: CalendarEvent[];
  lastUpdated: string;
}

// Type for the course calendar tool part
export type CourseCalendarToolPart = {
  type: 'tool-get_course_calendar';
  state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
  input: CourseCalendarInput;
  output?: CourseCalendarOutput;
  errorText?: string;
};