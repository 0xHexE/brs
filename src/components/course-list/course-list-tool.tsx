import React from 'react';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
} from '@/components/ai-elements/tool';
import { CourseListWidget } from './course-list-widget';
import type { CourseListToolPart } from '@/types/course-list';

interface CourseListToolProps {
  toolPart: CourseListToolPart;
}

export const CourseListTool: React.FC<CourseListToolProps> = ({ toolPart }) => {
  return (
    <Tool defaultOpen={true}>
      <ToolHeader 
        type="tool-list_courses" 
        state={toolPart.state}
        title="Course Catalog"
      />
      <ToolContent>
        <ToolOutput
          output={
            toolPart.output ? (
              <CourseListWidget courseData={toolPart.output} />
            ) : undefined
          }
          errorText={toolPart.errorText}
        />
      </ToolContent>
    </Tool>
  );
};