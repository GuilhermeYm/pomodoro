"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { set } from "zod";

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

  // Ciclos de trabalho
  const [workHours, setWorkHours] = useState(0);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [workSeconds, setWorkSeconds] = useState(0);

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
    trabalho: { hours: workHours, minutes: workMinutes, seconds: workSeconds },
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
    setWorkHours(Number(data.hours) || 0);
    setWorkMinutes(Number(data.minutes) || 0);
    setWorkSeconds(Number(data.seconds) || 0);

    // Timer atual
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
    // Função que gerencia a contagem regressiva
    const tickTimer = () => {
      setSeconds((prevSec) => {
        // Se ainda temos segundos, apenas decremente um
        if (prevSec > 0) {
          return prevSec - 1;
        }

        // Se chegamos a zero segundos, precisamos verificar os minutos
        setMinutes((prevMin) => {
          if (prevMin > 0) {
            return prevMin - 1; // Ainda temos minutos, decrementar um
          }

          // Se chegamos a zero minutos, verificamos as horas
          setHours((prevHrs) => {
            if (prevHrs > 0) {
              return prevHrs - 1; // Ainda temos horas, decrementar uma
            }

            // Timer terminou completamente
            handleTimerCompleted();
            return 0;
          });

          return 59; // Redefine minutos para 59 quando decrementa uma hora
        });

        return 59; // Redefine segundos para 59 quando decrementa um minuto
      });
    };

    // Função para lidar com o término do timer
    const handleTimerCompleted = () => {
      // Limpa o intervalo
      if (timerRef.current) {
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setIsTimerRunning(false);

      // Notificação
      if (Notification.permission === "granted") {
        const message =
          cycleType === "trabalho"
            ? "Hora de descansar!"
            : "Hora de voltar ao trabalho!";

        new Notification("Ciclo concluído!", { body: message });
      }

      // Avança para o próximo ciclo após 3 segundos
      setIsInterval(true);
      setIsWork(false)
      setTimeout(() => {
        // Se for o último intervalo longo, reseta o timer
        if (cycleType === "intervalo-longo" && currentCycle === totalCycles) {
          resetTimer();
        } else {
          advanceToNextCyle();
          setIsTimerRunning(true);
        }
      }, 3000);
    };

    // Limpa qualquer timer existente quando o estado de execução muda
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Inicia o timer apenas se estiver em execução
    if (isTimerRunning) {
      timerRef.current = setInterval(tickTimer, 1000);
    }

    // Limpeza para evitar memory leaks quando o componente é desmontado
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerRunning]); // Mantém apenas o isTimerRunning como dependência

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
