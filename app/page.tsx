"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center gap-8 px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          当前时间
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 min-w-[400px] text-center">
          <div className="text-6xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            {formatTime(currentTime)}
          </div>
          
          <div className="text-xl text-gray-600 dark:text-gray-300 mt-6">
            {formatDate(currentTime)}
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          实时更新中...
        </div>
      </main>
    </div>
  );
}
