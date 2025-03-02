"use client";

import { useState } from "react";

export default function useLocal() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(0);

  const createNewTime = () => {
    const newTime = new Date();
    console.log(newTime);
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    newTime.setSeconds(seconds);
    return newTime;
  };

  return {
    hours,
    minutes,
    seconds,
    isTimerRunning,
    createNewTime,
    intervalId
  };
}
