import { Game } from "@/components/game/game";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-night p-4">
      <Game />
      <p className="hidden text-center text-sm text-soft/70 portrait:max-md:block">
        Gira tu teléfono para jugar en grande.
      </p>
    </main>
  );
}
