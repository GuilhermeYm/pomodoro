import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useTimer } from "@/context/TimerContext";

const intervalFormSchema = z.object({
  shortIntervalHours: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => !val.includes(",") && !val.includes("."), {
      message: "Não pode ser um número decimal",
    }),
  shortIntervalMinutes: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => !val.includes(",") && !val.includes("."), {
      message: "Não pode ser um número decimal",
    }),
  shortIntervalSeconds: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => !val.includes(",") && !val.includes("."), {
      message: "Não pode ser um número decimal",
    }),
  longIntervalHours: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => !val.includes(",") && !val.includes("."), {
      message: "Não pode ser um número decimal",
    }),
  longIntervalMinutes: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => !val.includes(",") && !val.includes("."), {
      message: "Não pode ser um número decimal",
    }),
  longIntervalSeconds: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => !val.includes(",") && !val.includes("."), {
      message: "Não pode ser um número decimal",
    }),
});

export default function IntervalFormComponents({
  onClose,
  hoursShortInterval,
  minutesShortInterval,
  secondsShortInterval,
  hoursLongInterval,
  minutesLongInterval,
  secondsLongInterval,
}) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(intervalFormSchema),
    mode: "onChange",
  });
  const {} = useTimer();

  const handleSubmitTimer = (data) => {
    hoursShortInterval(data.shortIntervalHours);
    minutesShortInterval(data.shortIntervalMinutes);
    secondsShortInterval(data.shortIntervalSeconds);
    hoursLongInterval(data.longIntervalHours);
    minutesLongInterval(data.longIntervalMinutes);
    secondsLongInterval(data.longIntervalSeconds);
    onClose();
    return data;
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSubmitTimer)}
        className="flex flex-col gap-2 justify-center"
      >
        <div className="mt-2 text-2xl font-bold mb-2">
          x<h2>Configurar intervalo de tempos</h2>
        </div>
        <div className="border-b border-gray-700 pb-5 ">
          <label className="text-xl">Tempo do intervalo curto</label>
          <div className="grid grid-cols-3 px-4">
            <div className="flex flex-col justify-center items-center">
              <label htmlFor="hours" className="font-bold text-center">
                Horas
              </label>
              <input
                type="text"
                className="border outline-none rounded-2xl text-gray-700 w-20"
                {...register("shortIntervalHours")}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="hours" className="font-bold text-center">
                Minutos
              </label>
              <input
                type="text"
                className="border outline-none rounded-2xl text-gray-700 w-20"
                {...register("shortIntervalMinutes")}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="hours" className="font-bold text-center">
                Segundos
              </label>
              <input
                type="text"
                className="border outline-none rounded-2xl text-gray-700 w-20"
                {...register("shortIntervalSeconds")}
              />
            </div>
            {errors.shortIntervalHours ||
            errors.shortIntervalMinutes ||
            errors.shortIntervalSeconds ? (
              <div>
                <p>
                  {errors.shortIntervalHours?.message ||
                    errors.shortIntervalMinutes?.message ||
                    errors.shortIntervalSeconds?.message}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="border-b border-gray-700 pb-5 ">
          <label className="text-xl">Tempo do intervalo longo</label>
          <div className="grid grid-cols-3 px-4">
            <div className="flex flex-col justify-center items-center">
              <label htmlFor="hours" className="font-bold text-center">
                Horas
              </label>
              <input
                type="text"
                className="border outline-none rounded-2xl text-gray-700 w-20"
                {...register("longIntervalHours")}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="hours" className="font-bold text-center">
                Minutos
              </label>
              <input
                type="text"
                className="border outline-none rounded-2xl text-gray-700 w-20"
                {...register("longIntervalMinutes")}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="hours" className="font-bold text-center">
                Segundos
              </label>
              <input
                type="text"
                className="border outline-none rounded-2xl text-gray-700 w-20"
                {...register("longIntervalSeconds")}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center">
          <button
            onClick={onClose}
            type="button"
            className="bg-blue-500 text-gray-900 hover:bg-blue-700 px-4 py-2 rounded transition-colors duration-300 ease-in-out cursor-pointer"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="bg-gray-800 text-gray-300 hover:bg-gray-950 transition-colors duration-300 ease-in-out px-4 py-2 cursor-pointer rounded "
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </>
  );
}
