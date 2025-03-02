import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formTimerSchema = z.object({
    hours: z.string().nonempty("Campo obrigatório"),
    minutes: z.string().nonempty("Campo obrigatório"),
    seconds: z.string().nonempty("Campo obrigatório"),
    ciclos: z.number()
})

export default function FormTimerComponents({ onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formTimerSchema),
  });

  const handleSubmitTimer = (data) => {
    console.log(data);
    onClose(); // Fecha o formulário após envio
    return console.log("Formulário enviado");
  };

  return (
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
      <form onSubmit={handleSubmit(handleSubmitTimer)} className="flex flex-col gap-2">
        <div className="flex flex-col items-start gap-2">
            <label htmlFor="hours" className="text-xl">Horas</label>
            <input
                type="text"
                id="hours"
                {...register("hours")}
                className="p-2 border border-gray-300 rounded-md"
            />
            {errors.hours && <span>{errors.hours.message}</span>}
        </div>
        <div className="flex flex-col items-start gap-2">
            <label htmlFor="minutes" className="text-xl">Minutos</label>
            <input
                type="text"
                id="minutes"
                {...register("minutes")}
                className="p-2 border border-gray-300 rounded-md"
            />
            {errors.minutes && <span>{errors.minutes.message}</span>}
        </div>
        <div className="flex flex-col items-start gap-2">
            <label htmlFor="seconds" className="text-xl">Segundos</label>
            <input
                type="text"
                id="seconds"
                {...register("seconds")}
                className="p-2 border border-gray-300 rounded-md"
            />
            {errors.seconds && <span>{errors.seconds.message}</span>}
        </div>
        <div className="flex flex-col justify-center gap-2 mt-5">
            <label htmlFor="ciclos" className="text-xl">Ciclos</label>
            <input
                type="number"
                id="ciclos"
                {...register("ciclos")}
                className="w-20 p-2 border border-gray-300 rounded-md"
            />
            {errors.ciclos && <span>{errors.ciclos.message}</span>}
        </div>
        <div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5 cursor-pointer"
            >
                Enviar
            </button>
        </div>
      </form>
    </div>
  );
}
