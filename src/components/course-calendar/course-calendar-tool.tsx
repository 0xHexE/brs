import React from 'react';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
} from '@/components/ai-elements/tool';
import { CourseCalendarWidget } from './course-calendar-widget';
import type { CourseCalendarToolPart } from '@/types/course-calendar';

interface CourseCalendarToolProps {
  toolPart: CourseCalendarToolPart;
}

export const CourseCalendarTool: React.FC<CourseCalendarToolProps> = ({ toolPart }) => {
  return (
    <Tool defaultOpen={true}>
      <ToolHeader 
        type="tool-get_course_calendar" 
        state={toolPart.state}
        title="Course Calendar"
      />
      <ToolContent>
        <ToolOutput
          output={
            toolPart.output ? (
              <CourseCalendarWidget calendarData={toolPart.output} />
            ) : undefined
          }
          errorText={toolPart.errorText}
        />
      </ToolContent>
    </Tool>
  );
};