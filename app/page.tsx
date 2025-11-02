"use client";

import { useState, useEffect } from "react";

interface Timezone {
  id: string;
  name: string;
  zone: string;
}

const TIMEZONES: Timezone[] = [
  { id: "local", name: "本地时间", zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { id: "beijing", name: "北京", zone: "Asia/Shanghai" },
  { id: "tokyo", name: "东京", zone: "Asia/Tokyo" },
  { id: "london", name: "伦敦", zone: "Europe/London" },
  { id: "paris", name: "巴黎", zone: "Europe/Paris" },
  { id: "new_york", name: "纽约", zone: "America/New_York" },
  { id: "los_angeles", name: "洛杉矶", zone: "America/Los_Angeles" },
  { id: "dubai", name: "迪拜", zone: "Asia/Dubai" },
  { id: "sydney", name: "悉尼", zone: "Australia/Sydney" },
];

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(["local", "new_york", "london"]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timezone: string) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: timezone,
    });
  };

  const formatDate = (date: Date, timezone: string) => {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      timeZone: timezone,
    });
  };

  const getTimezoneName = (timezone: string) => {
    return TIMEZONES.find(tz => tz.id === timezone)?.name || timezone;
  };

  const getTimezoneZone = (timezone: string) => {
    return TIMEZONES.find(tz => tz.id === timezone)?.zone || timezone;
  };

  const toggleTimezone = (timezoneId: string) => {
    if (selectedTimezones.includes(timezoneId)) {
      if (selectedTimezones.length > 1) {
        setSelectedTimezones(selectedTimezones.filter(id => id !== timezoneId));
      }
    } else {
      setSelectedTimezones([...selectedTimezones, timezoneId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            世界时钟
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            实时显示不同时区的时间
          </p>
        </div>

        {/* Timezone Selector */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            选择时区
          </h2>
          <div className="flex flex-wrap gap-3">
            {TIMEZONES.map((timezone) => (
              <button
                key={timezone.id}
                onClick={() => toggleTimezone(timezone.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${
                    selectedTimezones.includes(timezone.id)
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }
                `}
              >
                {timezone.name}
              </button>
            ))}
          </div>
        </div>

        {/* Time Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTimezones.map((timezoneId) => {
            const zone = getTimezoneZone(timezoneId);
            const name = getTimezoneName(timezoneId);

            return (
              <div
                key={timezoneId}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {zone}
                  </p>

                  <div className="text-5xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                    {formatTime(currentTime, zone)}
                  </div>

                  <div className="text-lg text-gray-600 dark:text-gray-300">
                    {formatDate(currentTime, zone)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          实时更新中... 点击时区按钮添加或移除显示
        </div>
      </main>
    </div>
  );
}
