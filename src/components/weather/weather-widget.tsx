import React from 'react';
import type { WeatherToolOutput } from '@/types/weather';

interface WeatherWidgetProps {
  weatherData: WeatherToolOutput;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weatherData }) => {
  const getWeatherIcon = (conditions: string) => {
    switch (conditions.toLowerCase()) {
      case 'sunny':
        return '☀️';
      case 'cloudy':
        return '☁️';
      case 'rainy':
        return '🌧️';
      case 'snowy':
        return '❄️';
      case 'partly cloudy':
        return '⛅';
      default:
        return '🌤️';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white max-w-sm mx-auto shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">{weatherData.location}</h3>
          <p className="text-blue-100 text-sm">{weatherData.lastUpdated}</p>
        </div>
        <div className="text-5xl">
          {getWeatherIcon(weatherData.conditions)}
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <span className="text-5xl font-light mr-4">{weatherData.temperature}</span>
        <div>
          <p className="text-xl font-medium">{weatherData.conditions}</p>
          <p className="text-blue-100">Feels like {weatherData.temperature}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 bg-blue-500/30 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-2xl mr-2">💧</span>
          <div>
            <p className="text-blue-100 text-sm">Humidity</p>
            <p className="font-semibold">{weatherData.humidity}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-2xl mr-2">💨</span>
          <div>
            <p className="text-blue-100 text-sm">Wind Speed</p>
            <p className="font-semibold">{weatherData.windSpeed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};