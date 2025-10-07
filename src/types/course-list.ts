export interface CourseListInput {
  department?: string;
  level?: 'undergraduate' | 'graduate' | 'all';
  search?: string;
}

export interface CourseInfo {
  id: string;
  code: string;
  name: string;
  department: string;
  level: 'undergraduate' | 'graduate';
  credits: number;
  description: string;
  prerequisites: string[];
  instructor: string;
  schedule: {
    days: string[];
    time: string;
    room: string;
  };
  capacity: number;
  enrolled: number;
  status: 'open' | 'closed' | 'waitlist';
  semester: string;
  year: number;
}

export interface CourseListOutput {
  courses: CourseInfo[];
  totalCount: number;
  filters: {
    department?: string;
    level?: string;
    search?: string;
  };
  lastUpdated: string;
}

// Type for the course list tool part
export type CourseListToolPart = {
  type: 'tool-list_courses';
  state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
  input: CourseListInput;
  output?: CourseListOutput;
  errorText?: string;
};