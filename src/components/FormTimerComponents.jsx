import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTimer } from "@/context/TimerContext";
import IntervalFormComponents from "./IntervalFormComponents";
import { useState } from "react";

const formTimerSchema = z.object({
  hours: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => !isNaN(parseInt(val)), {
      message: "Deve ser um número válido",
    })
    .refine((val) => parseInt(val) >= 0, {
      message: "O valor deve ser maior ou igual a zero",
    })
    .refine((val) => !val.includes(".") && !val.includes(","), {
      message: "Não pode ser um número decimal",
    }),
  minutes: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => !isNaN(parseInt(val)), {
      message: "Deve ser um número válido",
    })
    .refine((val) => parseInt(val) >= 0 && parseInt(val) < 60, {
      message: "O valor deve estar entre 0 e 59",
    })
    .refine((val) => !val.includes(".") && !val.includes(","), {
      message: "Não pode ser um número decimal",
    }),
  seconds: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => !isNaN(parseInt(val)), {
      message: "Deve ser um número válido",
    })
    .refine((val) => parseInt(val) >= 0 && parseInt(val) < 60, {
      message: "O valor deve estar entre 0 e 59",
    })
    .refine((val) => !val.includes(".") && !val.includes(","), {
      message: "Não pode ser um número decimal",
    }),
  ciclos: z
    .string()
    .refine((val) => val === "" || !isNaN(parseInt(val)), {
      message: "Deve ser um número inteiro válido",
    })
    .refine((val) => val === "" || parseInt(val) > 0, {
      message: "O valor deve ser maior que zero",
    })
    .refine((val) => !val.includes(".") && !val.includes(","), {
      message: "Não pode ser um número decimal",
    })
    .optional()
    .transform((val) => (val === "" ? "4" : val)), // valor padrão
});

export default function FormTimerComponents({ onClose }) {
  const [showIntervalForm, setShowIntervalForm] = useState(false);
  const [hoursShortInterval, setHoursShortInterval] = useState(0);
  const [minutesShortInterval, setMinutesShortInterval] = useState(0);
  const [secondsShortInterval, setSecondsShortInterval] = useState(0);
  const [hoursLongInterval, setHoursLongInterval] = useState(0);
  const [minutesLongInterval, setMinutesLongInterval] = useState(0);
  const [secondsLongInterval, setSecondsLongInterval] = useState(0);
  const { createNewTime } = useTimer();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formTimerSchema),
    mode: "onChange",
  });

  const handleSubmitTimer = (data) => {
    if (
      confirm(
        "Se você não alterar a configuração dos ciclos, o tempo deles continuará sendo o padrão."
      )
    ) {
      onClose(); // Fecha o formulário após envio
      const newObject = {
        ...data,
        hoursLongInterval,
        minutesLongInterval,
        secondsLongInterval,
        hoursShortInterval,
        minutesShortInterval,
        secondsShortInterval,
      };
      const createdNewTimer = createNewTime(newObject);
    } else {
      return false;
    }
  };

  return (
    <>
      {showIntervalForm ? (
        <div>
          <IntervalFormComponents
            onClose={() => setShowIntervalForm(false)}
            hoursLongInterval={setHoursLongInterval}
            hoursShortInterval={setHoursShortInterval}
            minutesLongInterval={setMinutesLongInterval}
            minutesShortInterval={setMinutesShortInterval}
            secondsLongInterval={setSecondsLongInterval}
            secondsShortInterval={setSecondsShortInterval}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between mb-4 gap-10">
            <h2 className="text-2xl font-bold">Configure o Timer</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
            >
              ×
            </button>
          </div>
          <form
            onSubmit={handleSubmit(handleSubmitTimer)}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="hours" className="text-xl">
                Horas
              </label>
              <input
                type="text"
                id="hours"
                {...register("hours")}
                className="p-2 border border-gray-300 rounded-md"
              />
              {errors.hours && <span>{errors.hours.message}</span>}
            </div>
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="minutes" className="text-xl">
                Minutos
              </label>
              <input
                type="text"
                id="minutes"
                {...register("minutes")}
                className="p-2 border border-gray-300 rounded-md"
              />
              {errors.minutes && <span>{errors.minutes.message}</span>}
            </div>
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="seconds" className="text-xl">
                Segundos
              </label>
              <input
                type="text"
                id="seconds"
                {...register("seconds")}
                className="p-2 border border-gray-300 rounded-md"
              />
              {errors.seconds && <span>{errors.seconds.message}</span>}
            </div>
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="ciclos" className="text-xl">
                Ciclos
              </label>
              <input
                type="number"
                id="ciclos"
                {...register("ciclos")}
                className="w-20 p-2 border border-gray-300 rounded-md"
              />
              {errors.ciclos && <span>{errors.ciclos.message}</span>}
            </div>
            <div className="flex justify-between gap-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
              >
                Enviar
              </button>
              <button
                onClick={() => setShowIntervalForm(true)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
                type="button"
              >
                Configurar intervalo
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
