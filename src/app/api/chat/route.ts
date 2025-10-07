import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create custom OpenAI provider
const openaiProvider = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
  name: process.env.OPENAI_PROVIDER_NAME || 'openai',
});

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
  }: {
    messages: UIMessage[];
    model: string;
    webSearch: boolean;
  } = await req.json();

  // Use configured chat model if not specified
  const selectedModel =
    model || process.env.CHAT_MODEL || 'zai-org/GLM-4.6-turbo';

  const result = streamText({
    model: webSearch ? 'perplexity/sonar' : openaiProvider.chat(selectedModel),
    messages: convertToModelMessages(messages),
    system:
      'You are a helpful AI assistant for Umm Al-Qura University student management system. You can help students with course schedules, prerequisites, tuition payments, financial aid, academic transcripts, tutoring services, and other university-related inquiries.',
    tools: {
      fetch_weather_data: {
        description: 'Fetch weather information for a specific location',
        parameters: z.object({
          location: z
            .string()
            .describe('The city or location to get weather for'),
          units: z
            .enum(['celsius', 'fahrenheit'])
            .default('celsius')
            .describe('Temperature units'),
        }),
        inputSchema: z.object({
          location: z.string(),
          units: z.enum(['celsius', 'fahrenheit']).default('celsius'),
        }),
        execute: async ({ location, units }) => {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const temp =
            units === 'celsius'
              ? Math.floor(Math.random() * 35) + 5
              : Math.floor(Math.random() * 63) + 41;

          return {
            location,
            temperature: `${temp}°${units === 'celsius' ? 'C' : 'F'}`,
            conditions: 'Sunny',
            humidity: `12%`,
            windSpeed: `35 ${units === 'celsius' ? 'km/h' : 'mph'}`,
            lastUpdated: new Date().toLocaleString(),
          };
        },
      },
      get_course_calendar: {
        description: 'Get course calendar and schedule for a student',
        parameters: z.object({
          month: z
            .number()
            .optional()
            .describe('The month (1-12, defaults to current month)'),
          year: z
            .number()
            .optional()
            .describe('The year (defaults to current year)'),
        }),
        inputSchema: z.object({
          month: z.number().optional(),
          year: z.number().optional(),
        }),
        execute: async ({ month, year }) => {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Auto-calculate current month and year if not provided
          const currentDate = new Date();
          const selectedMonth = month || currentDate.getMonth() + 1;
          const selectedYear = year || currentDate.getFullYear();

          // Determine semester based on month
          let semester = '';
          if (selectedMonth >= 8 && selectedMonth <= 12) {
            semester = 'Fall';
          } else if (selectedMonth >= 1 && selectedMonth <= 4) {
            semester = 'Spring';
          } else {
            semester = 'Summer';
          }

          // Mock course data
          const courses = [
            {
              id: 'CS301',
              code: 'CS301',
              name: 'Data Structures and Algorithms',
              instructor: 'Dr. Sarah Johnson',
              credits: 3,
              schedule: {
                days: ['Monday', 'Wednesday', 'Friday'],
                time: '10:00 AM - 11:00 AM',
                room: 'Room 301',
              },
              color: '#3B82F6',
            },
            {
              id: 'MATH201',
              code: 'MATH201',
              name: 'Discrete Mathematics',
              instructor: 'Prof. Michael Chen',
              credits: 4,
              schedule: {
                days: ['Tuesday', 'Thursday'],
                time: '2:00 PM - 3:30 PM',
                room: 'Room 205',
              },
              color: '#10B981',
            },
            {
              id: 'ENG101',
              code: 'ENG101',
              name: 'Academic Writing',
              instructor: 'Dr. Emily Davis',
              credits: 3,
              schedule: {
                days: ['Monday', 'Wednesday'],
                time: '1:00 PM - 2:30 PM',
                room: 'Room 102',
              },
              color: '#F59E0B',
            },
          ];

          // Mock events
          const events = [
            {
              id: '1',
              title: 'CS301 Midterm Exam',
              date: '2024-03-15',
              time: '9:00 AM - 11:00 AM',
              type: 'exam' as const,
              courseCode: 'CS301',
              location: 'Room 301',
            },
            {
              id: '2',
              title: 'MATH201 Assignment Due',
              date: '2024-03-18',
              time: '11:59 PM',
              type: 'assignment' as const,
              courseCode: 'MATH201',
            },
            {
              id: '3',
              title: 'Spring Break',
              date: '2024-03-25',
              time: 'All Day',
              type: 'holiday' as const,
            },
            {
              id: '4',
              title: 'ENG101 Essay Submission',
              date: '2024-03-20',
              time: '5:00 PM',
              type: 'assignment' as const,
              courseCode: 'ENG101',
            },
          ];

          return {
            studentId: 'STU001',
            month: selectedMonth,
            year: selectedYear,
            semester,
            courses,
            events,
            lastUpdated: new Date().toLocaleString(),
          };
        },
      },
      list_courses: {
        description: 'List available courses from the course catalog',
        parameters: z.object({
          department: z
            .string()
            .optional()
            .describe('Filter by department (e.g., Computer Science, Mathematics)'),
          level: z
            .enum(['undergraduate', 'graduate', 'all'])
            .default('all')
            .describe('Filter by course level'),
          search: z
            .string()
            .optional()
            .describe('Search term to filter courses by name or code'),
        }),
        inputSchema: z.object({
          department: z.string().optional(),
          level: z.enum(['undergraduate', 'graduate', 'all']).default('all'),
          search: z.string().optional(),
        }),
        execute: async ({ department, level, search }) => {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Mock course data
          const allCourses = [
            {
              id: 'CS101',
              code: 'CS101',
              name: 'Introduction to Computer Science',
              department: 'Computer Science',
              level: 'undergraduate' as const,
              credits: 3,
              description: 'Fundamental concepts of computer science including programming, algorithms, and data structures.',
              prerequisites: [],
              instructor: 'Dr. Alice Smith',
              schedule: {
                days: ['Monday', 'Wednesday', 'Friday'],
                time: '9:00 AM - 10:00 AM',
                room: 'Room 101',
              },
              capacity: 30,
              enrolled: 28,
              status: 'open' as const,
              semester: 'Fall 2024',
              year: 2024,
            },
            {
              id: 'CS301',
              code: 'CS301',
              name: 'Data Structures and Algorithms',
              department: 'Computer Science',
              level: 'undergraduate' as const,
              credits: 4,
              description: 'Advanced study of data structures, algorithms, and their analysis.',
              prerequisites: ['CS101'],
              instructor: 'Dr. Sarah Johnson',
              schedule: {
                days: ['Tuesday', 'Thursday'],
                time: '10:00 AM - 11:30 AM',
                room: 'Room 301',
              },
              capacity: 25,
              enrolled: 25,
              status: 'closed' as const,
              semester: 'Fall 2024',
              year: 2024,
            },
            {
              id: 'CS401',
              code: 'CS401',
              name: 'Machine Learning',
              department: 'Computer Science',
              level: 'undergraduate' as const,
              credits: 3,
              description: 'Introduction to machine learning algorithms and applications.',
              prerequisites: ['CS301', 'MATH201'],
              instructor: 'Dr. Robert Chen',
              schedule: {
                days: ['Monday', 'Wednesday'],
                time: '2:00 PM - 3:30 PM',
                room: 'Room 401',
              },
              capacity: 20,
              enrolled: 18,
              status: 'open' as const,
              semester: 'Fall 2024',
              year: 2024,
            },
            {
              id: 'CS501',
              code: 'CS501',
              name: 'Advanced Artificial Intelligence',
              department: 'Computer Science',
              level: 'graduate' as const,
              credits: 3,
              description: 'Advanced topics in artificial intelligence including deep learning and neural networks.',
              prerequisites: ['CS401'],
              instructor: 'Dr. Emily Davis',
              schedule: {
                days: ['Tuesday', 'Thursday'],
                time: '3:00 PM - 4:30 PM',
                room: 'Room 501',
              },
              capacity: 15,
              enrolled: 12,
              status: 'open' as const,
              semester: 'Fall 2024',
              year: 2024,
            },
            {
              id: 'MATH101',
              code: 'MATH101',
              name: 'Calculus I',
              department: 'Mathematics',
              level: 'undergraduate' as const,
              credits: 4,
              description: 'Introduction to differential and integral calculus.',
              prerequisites: [],
              instructor: 'Prof. Michael Brown',
              schedule: {
                days: ['Monday', 'Wednesday', 'Friday'],
                time: '11:00 AM - 12:00 PM',
                room: 'Room 201',
              },
              capacity: 35,
              enrolled: 32,
              status: 'open' as const,
              semester: 'Fall 2024',
              year: 2024,
            },
            {
              id: 'MATH201',
              code: 'MATH201',
              name: 'Discrete Mathematics',
              department: 'Mathematics',
              level: 'undergraduate' as const,
              credits: 3,
              description: 'Fundamental concepts of discrete mathematics for computer science.',
              prerequisites: ['MATH101'],
              instructor: 'Prof. Lisa Wilson',
              schedule: {
                days: ['Tuesday', 'Thursday'],
                time: '1:00 PM - 2:30 PM',
                room: 'Room 205',
              },
              capacity: 30,
              enrolled: 30,
              status: 'waitlist' as const,
              semester: 'Fall 2024',
              year: 2024,
            },
            {
              id: 'ENG101',
              code: 'ENG101',
              name: 'Academic Writing',
              department: 'English',
              level: 'undergraduate' as const,
              credits: 3,
              description: 'Development of academic writing skills for university-level coursework.',
              prerequisites: [],
              instructor: 'Dr. James Taylor',
              schedule: {
                days: ['Monday', 'Wednesday'],
                time: '10:00 AM - 11:30 AM',
                room: 'Room 102',
              },
              capacity: 25,
              enrolled: 20,
              status: 'open' as const,
              semester: 'Fall 2024',
              year: 2024,
            },
            {
              id: 'PHYS101',
              code: 'PHYS101',
              name: 'Physics I',
              department: 'Physics',
              level: 'undergraduate' as const,
              credits: 4,
              description: 'Introduction to mechanics, thermodynamics, and waves.',
              prerequisites: ['MATH101'],
              instructor: 'Dr. Maria Garcia',
              schedule: {
                days: ['Tuesday', 'Thursday'],
                time: '8:00 AM - 9:30 AM',
                room: 'Room 301',
              },
              capacity: 30,
              enrolled: 25,
              status: 'open' as const,
              semester: 'Fall 2024',
              year: 2024,
            },
          ];

          // Apply filters
          let filteredCourses = allCourses;

          if (department) {
            filteredCourses = filteredCourses.filter(
              course => course.department.toLowerCase().includes(department.toLowerCase())
            );
          }

          

          if (level && level !== 'all') {
            filteredCourses = filteredCourses.filter(
              course => course.level === level
            );
          }

          if (search) {
            const searchLower = search.toLowerCase();
            filteredCourses = filteredCourses.filter(
              course =>
                course.code.toLowerCase().includes(searchLower) ||
                course.name.toLowerCase().includes(searchLower) ||
                course.description.toLowerCase().includes(searchLower)
            );
          }

          return {
            courses: filteredCourses,
            totalCount: filteredCourses.length,
            filters: {
              department,
              level,
              search,
            },
            lastUpdated: new Date().toLocaleString(),
          };
        },
      },
    },
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
