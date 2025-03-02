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
  const timerRef = useRef(null);
  const [isInterval, setIsInterval] = useState(false);
  const [isWork, setIsWork] = useState(true);

  // Novos estados para o ciclo
  const [currentCycle, setCurrentCycle] = useState(1); // Ciclo atual
  const [totalCycles, setTotalCycles] = useState(0); // Total de ciclos
  const [cycleType, setCycleType] = useState("trabalho"); // Tipo de ciclo: trabalho ou descanso

  // Configurações padrão de tempo para cada tipo de ciclo
  const cycleConfigs = {
    trabalho: { hours: hours, minutes: minutes, seconds: seconds },
    "intervalo-curto": { hours: 0, minutes: 1, seconds: 0 },
    "intervalo-longo": { hours: 0, minutes: 1, seconds: 0 },
  };

  // Função para criar um novo timer
  const createNewTime = (data) => {
    setHours(Number(data.hours) || 0);
    setMinutes(Number(data.minutes) || 0);
    setSeconds(Number(data.seconds) || 0);
    setIsTimerRunning(true);

    // Configuração dos ciclos
    setCurrentCycle(1);
    setTotalCycles(Number(data.ciclos) || 4);
    setCycleType("trabalho");

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
    let nextCycle;

    // Se o tipo de ciclo for trabalho, avança para algum tipo de intervalo
    if (cycleType === "trabalho") {
      // Se estiver no último ciclo, avança para o intervalo longo
      if (currentCycle === totalCycles) {
        nextCycleType = "intervalo-longo";
        setIsInterval(true);
        setIsWork(false);
      } // Se não for o último ciclo, o próximo clico será um intervalo curto
      else {
        nextCycleType = "intervalo-curto";
        setIsInterval(true);
        setIsWork(false);
      }
    } else {
      // Se o tipo de ciclo for intervalo, avança para o próximo ciclo de trabalho
      nextCycleType = "trabalho";
      // Se o ciclo anterior foi um intervalo longo, reincia a contagem
      if (cycleType === "intervalo-longo") {
        nextCycle = 1;
        setIsInterval(false);
        setIsWork(true);
      } else {
        // Se não, avança para o próximo ciclo
        nextCycle = currentCycle + 1;
        setIsInterval(false);
        setIsWork(true);
      }
    }

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
    console.log(timerRef.current);
    console.log(timerRef);
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
