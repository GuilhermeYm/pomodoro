import WatchPomodoroComponents from "./WatchPomodoroComponents";

export default function MainComponents() {
  return (
    <main className="font-[family-name:var(--font-inter)] min-h-80 w-[70vw] mx-auto shadowsm shadow-white py-10 px-5 mt-10 rounded-2xl bg-white text-gray-800">
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Bem-vindo</h1>
        <p className="text-xl">
          Um simples site para ajudar você a se manter focado.
        </p>
      </section>
      <WatchPomodoroComponents />
    </main>
  );
}
