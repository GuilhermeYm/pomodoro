"use client";

import useLocal from "@/hooks/useLocal";
import FormTimerComponents from "./FormTimerComponents";
import { useState } from "react";

export default function WatchPomodoroComponents() {
  const { isTimerRunning, intervalId } = useLocal();
  const [showFormTimer, setShowFormTimer] = useState(false);

  const handleTimer = () => {
    // Se for falso, vai aparecer o componente de form
    if (!isTimerRunning) {
      setShowFormTimer(true);
    }
  };

  const handleCloseForm = () => {
    setShowFormTimer(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 relative">
      <div
        className={showFormTimer ? "filter blur-sm pointer-events-none" : ""}
      >
        <article className="grid grid-cols-3 flex-1 mt-10 gap-10 text-center text-4xl font-bold">
          <section className="flex flex-col items-center ">
            <div>00</div>
            <div>Horas</div>
          </section>
          <section className="flex flex-col items-center">
            <div>00</div>
            <div>Minutos</div>
          </section>
          <section className="flex flex-col items-center">
            <div>00</div>
            <div>Segundos</div>
          </section>
        </article>
        <div className="flex items-center justify-center text-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-full mt-10 cursor-pointer"
            disabled={isTimerRunning}
            onClick={() => handleTimer()}
          >
            Iniciar
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-full mt-10 ml-5"
            disabled={!isTimerRunning}
          >
            Parar
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <p className="font-bold">Ciclo:</p>
          <span>{intervalId ? intervalId : "00"}</span>
        </div>
      </div>

      {showFormTimer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white py-10 px-10 rounded-lg shadow-xl">
            <FormTimerComponents onClose={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
}
