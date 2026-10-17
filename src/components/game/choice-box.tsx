import type { ChoiceOption } from "@/game/types";

type Props = {
  prompt: string;
  options: ChoiceOption[];
  onChoose: (index: number) => void;
};

export function ChoiceBox({ prompt, options, onChoose }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-[4%]">
      <div className="w-full max-w-[70%] animate-rise rounded-xl border-4 border-outline bg-[#07120a] p-[2cqw] font-mono text-[1.8cqw] text-emerald-300 shadow-[0_0_2em_rgba(52,211,153,0.3)]">
        <p className="mb-[1.5cqw] text-emerald-100">{prompt}</p>
        <ol className="space-y-[0.8cqw]">
          {options.map((option, index) => (
            <li key={option.label}>
              <button
                type="button"
                onClick={() => onChoose(index)}
                className="w-full cursor-pointer rounded px-[1cqw] py-[0.5cqw] text-left hover:bg-emerald-400/15 focus-visible:bg-emerald-400/15 focus-visible:outline-none"
              >
                <span className="text-emerald-500">$</span> {option.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
