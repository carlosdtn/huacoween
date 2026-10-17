import { PixelBackdrop } from "@/components/pixel/pixel-backdrop";
import { PixelSprite } from "@/components/pixel/pixel-sprite";
import { META } from "@/game/content/meta";
import * as cast from "@/pixel/sprites/characters";
import { CardButton } from "./end-card";

type Props = { canResume: boolean; onNew: () => void; onResume: () => void };

const CAST = [
  cast.tito.idle,
  cast.chicharron,
  cast.luchaAnim,
  cast.muquiAnim,
  cast.band,
];

export function TitleScreen({ canResume, onNew, onResume }: Props) {
  return (
    <div className="absolute inset-0">
      <PixelBackdrop scene="cemeteryGate" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[1cqw] pb-[12%]">
        <PixelSprite
          art={cast.huacosaw}
          unit="0.17cqw"
          label="Huacosaw"
          className="-scale-x-100"
        />
        <h1 className="font-display text-[8cqw] leading-none text-pumpkin [text-shadow:0.08em_0.08em_0_#140c1c]">
          {META.title.toUpperCase()}
        </h1>
        <p className="font-display text-[2.4cqw] text-soft [text-shadow:0.1em_0.1em_0_#140c1c]">
          {META.subtitle}
        </p>
        <div className="flex gap-[1cqw]">
          <CardButton primary onClick={onNew}>
            Nueva partida
          </CardButton>
          {canResume && <CardButton onClick={onResume}>Continuar</CardButton>}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[3%] flex items-end justify-center gap-[2cqw]">
        {CAST.map((art, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed cast list
          <PixelSprite key={i} art={art} unit="0.15cqw" />
        ))}
      </div>
    </div>
  );
}
