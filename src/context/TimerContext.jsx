"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

// 1. Criar contexto
const TimerContext = createContext({});

// 2.Provider

export function TimerProvider({ children }) {
  // Estados existentes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isInterval, setIsInterval] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const timerRef = useRef(null);

  // Novos estados para o ciclo
  const [currentCycle, setCurrentCycle] = useState(0); // Ciclo atual
  const [totalCycles, setTotalCycles] = useState(0); // Total de ciclos
  const [cycleType, setCycleType] = useState("trabalho"); // Tipo de ciclo: trabalho ou descanso
  const [hoursShortInterval, setHoursShortInterval] = useState(0);
  const [minutesShortInterval, setMinutesShortInterval] = useState(5);
  const [secondsShortInterval, setSecondsShortInterval] = useState(0);
  const [hoursLongInterval, setHoursLongInterval] = useState(0);
  const [minutesLongInterval, setMinutesLongInterval] = useState(15);
  const [secondsLongInterval, setSecondsLongInterval] = useState(0);

  // Configurações padrão de tempo para cada tipo de ciclo
  const cycleConfigs = {
    trabalho: { hours: hours, minutes: minutes, seconds: seconds },
    "intervalo-curto": {
      hours: hoursShortInterval,
      minutes: minutesShortInterval,
      seconds: secondsShortInterval,
    },
    "intervalo-longo": {
      hours: hoursLongInterval,
      minutes: minutesLongInterval,
      seconds: secondsLongInterval,
    },
  };

  // Função para criar um novo timer
  const createNewTime = (data) => {
    setHours(Number(data.hours) || 0);
    setMinutes(Number(data.minutes) || 0);
    setSeconds(Number(data.seconds) || 0);
    setIsTimerRunning(true);

    // Configuração dos ciclos
    setCurrentCycle(1);
    setTotalCycles(Number(data.ciclos));
    setCycleType("trabalho");
    // Setando os valores dos intervalos
    setHoursLongInterval(Number(data.hoursLongInterval) || 0);
    setMinutesLongInterval(Number(data.minutesLongInterval) || 0);
    setSecondsLongInterval(Number(data.secondsLongInterval) || 0);
    setHoursShortInterval(Number(data.hoursShortInterval) || 0);
    setMinutesShortInterval(Number(data.minutesShortInterval) || 0);
    setSecondsShortInterval(Number(data.secondsShortInterval) || 0);
    return true;
  };

  const resetTimer = () => {
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setIsTimerRunning(false);
  };

  // Função para avançar para o próximo ciclo
  const advanceToNextCyle = () => {
    // Qual é o próximo tipo de ciclo?
    let nextCycleType;
    let nextCycle = currentCycle;

    // Se o tipo de ciclo for trabalho, avança para algum tipo de intervalo
    if (cycleType === "trabalho") {
      // Se estiver no último ciclo, avança para o intervalo longo
      if (currentCycle === totalCycles) {
        nextCycleType = "intervalo-longo";
        setIsWork(false);
        setIsInterval(true);
      } // Se não for o último ciclo, o próximo clico será um intervalo curto
      else {
        nextCycleType = "intervalo-curto";
        setIsWork(false);
        setIsInterval(true);
      }
    } else {
      // Se o tipo de ciclo for intervalo, avança para o próximo ciclo de trabalho
      nextCycleType = "trabalho";
      // Se o ciclo anterior foi um intervalo longo, reincia a contagem
      if (cycleType === "intervalo-longo") {
        setIsWork(true);
        setIsInterval(false);
        nextCycle = 1;
      } else {
        // Se não, avança para o próximo ciclo
        nextCycle = currentCycle + 1;
        setIsWork(true);
        setIsInterval(false);
      }
    }

    console.log("Ciclo atual", currentCycle);
    console.log("O próximo ciclo", nextCycle);
    console.log("Tipo de ciclo atual", cycleType);
    console.log("O próximo tipo de ciclo", nextCycleType);
    // Configura o próximo ciclo
    setCycleType(nextCycleType);
    setCurrentCycle(nextCycle);

    // Define os tempos para o próximo ciclo
    const nextConfig = cycleConfigs[nextCycleType];
    setHours(nextConfig.hours);
    setMinutes(nextConfig.minutes);
    setSeconds(nextConfig.seconds);
  };

  // Efeito para gerenciar o timer
  useEffect(() => {
    // Se tiver algum timer rodando, limpa ele
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Se o timer estiver rodando, cria um intervalo para decrementar o tempo - Coração do código
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        // Lógica para decrementar o tempo. segundos -> minutos -> horas
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else if (hours > 0) {
          setHours((prev) => prev - 1);
          setMinutes(59);
          setSeconds(59);
        } else {
          // Timer terminou: limpa o intervalo, para o timer e envia notificação
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsTimerRunning(false);

          // Notificação
          if (Notification.permission === "granted") {
            const message =
              cycleType === "trabalho"
                ? "Hora de descansar!"
                : "Hora de voltar ao trabalho!";

            new Notification("Ciclo concluído!", {
              body: message,
            });
          }

          // Avança para o próximo ciclo após 3 segundos
          setTimeout(() => {
            // Se for o último intervalo longo, reseta o timer
            if (
              cycleType === "intervalo-longo" &&
              currentCycle === totalCycles
            ) {
              resetTimer();
            } else {
              advanceToNextCyle();
              setIsTimerRunning(true);
            }
          }, 3000);
        }
      }, 1000); // Executa a cada um segundo
    }

    console.log(
      "Números do intervalo longo",
      hoursLongInterval,
      minutesLongInterval,
      secondsLongInterval
    );
    console.log(
      "Números do intervalo curto",
      hoursShortInterval,
      minutesShortInterval,
      secondsShortInterval
    );

    // Função de limpeza para evitar memory leaks
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, hours, minutes, seconds]); // UseEffect será executado sempre que essas variáveis mudarem

  // Valores que serão disponibilizados para toda a aplicação
  const value = {
    hours,
    minutes,
    seconds,
    isTimerRunning,
    setIsTimerRunning,
    createNewTime,
    resetTimer,
    currentCycle,
    totalCycles,
    isWork,
    isInterval,
    cycleType,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("TimerContext deve ser usado dentro de um AuthProvider");
  }
  return context;
}
