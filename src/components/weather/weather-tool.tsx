import React from 'react';
import type { ToolUIPart } from 'ai';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';
import { WeatherWidget } from './weather-widget';
import type { WeatherToolPart } from '@/types/weather';

interface WeatherToolProps {
  toolPart: WeatherToolPart;
}

export const WeatherTool: React.FC<WeatherToolProps> = ({ toolPart }) => {
  return (
    <Tool defaultOpen={true}>
      <ToolHeader
        type="tool-fetch_weather_data"
        state={toolPart.state}
        title="Weather Information"
      />
      <ToolContent>
        <ToolOutput
          output={
            toolPart.output ? (
              <WeatherWidget weatherData={toolPart.output} />
            ) : undefined
          }
          errorText={toolPart.errorText}
        />
      </ToolContent>
    </Tool>
  );
};