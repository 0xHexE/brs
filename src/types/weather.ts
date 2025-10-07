export interface WeatherToolInput {
  location: string;
  units: 'celsius' | 'fahrenheit';
}

export interface WeatherToolOutput {
  location: string;
  temperature: string;
  conditions: string;
  humidity: string;
  windSpeed: string;
  lastUpdated: string;
}

export interface WeatherToolData {
  fetch_weather_data: {
    input: WeatherToolInput;
    output: WeatherToolOutput;
  };
}

// Type for the weather tool part that matches the expected ToolUIPart structure
export type WeatherToolPart = {
  type: 'tool-fetch_weather_data';
  state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
  input: WeatherToolInput;
  output?: WeatherToolOutput;
  errorText?: string;
};