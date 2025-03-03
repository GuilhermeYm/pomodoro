export default function HeaderComponents() {
  return (
    <header className="min-w-screen flex justify-around items-center px-6 py-10 font-[family-name:var(--font-inter)] min-h-20 border-b mb-10">
      <h1 className="text-2xl font-bold">Pomodoro</h1>
      <nav className="flex text-xl">
        <ul className="flex space-x-4">
          <li>Home</li>
          <li>Contato</li>
        </ul>
      </nav>
    </header>
  );
}
