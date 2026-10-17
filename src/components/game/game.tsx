"use client";

import { useEffect, useRef, useState } from "react";
import { playSong } from "@/audio/music";
import { sceneSongs } from "@/audio/songs";
import { DeathScene } from "@/components/pixel/death-scene";
import { Stage } from "@/components/pixel/stage";
import { deaths } from "@/game/content/deaths";
import { endings } from "@/game/content/endings";
import type { ItemId } from "@/game/content/items";
import { META } from "@/game/content/meta";
import { puzzles } from "@/game/content/puzzles";
import { scenes } from "@/game/content/scenes";
import { loadProgress } from "@/game/engine/save";
import type { Progress } from "@/game/engine/state";
import { ChoiceBox } from "./choice-box";
import { DialogBox } from "./dialog-box";
import { CardButton, EndCard } from "./end-card";
import { Hud } from "./hud";
import { Inventory } from "./inventory";
import { ItemCursor } from "./item-cursor";
import { ItemToast } from "./item-toast";
import { Keypad } from "./keypad";
import { RhythmPad } from "./rhythm-pad";
import { StatusBar } from "./status-bar";
import { TitleScreen } from "./title-screen";
import { useGame } from "./use-game";

const puzzleViews = { code: Keypad, rhythm: RhythmPad };

export function Game() {
  const [state, dispatch] = useGame();
  const [combining, setCombining] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<ItemId | null>(null);
  const [saved, setSaved] = useState<Progress | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { status, overlay, scene } = state;

  useEffect(() => {
    if (status.kind === "title") setSaved(loadProgress());
  }, [status.kind]);

  // Each part of the night has its own tune; the title keeps the villain's theme.
  useEffect(() => {
    if (status.kind === "playing") playSong(sceneSongs[scene]);
  }, [status.kind, scene]);

  const begin = (action: () => void) => {
    playSong("villain");
    setCombining(false);
    action();
  };

  const toTitle = () => dispatch({ type: "toTitle" });

  return (
    <div className="@container mx-auto w-full max-w-[min(100%,calc((100dvh-2rem)*1.42))]">
      <StatusBar
        title={status.kind === "title" ? META.title : scenes[scene].title}
        selected={state.selectedItem}
        combining={combining}
        hovered={hoveredItem}
      />
      <div
        ref={stage}
        className="relative aspect-video overflow-hidden border-x-4 border-outline bg-night select-none"
      >
        <Hud
          onHint={
            status.kind === "playing" && !overlay
              ? () => dispatch({ type: "hint" })
              : undefined
          }
        />
        {status.kind === "title" ? (
          <TitleScreen
            canResume={saved !== null}
            onNew={() => begin(() => dispatch({ type: "newGame" }))}
            onResume={() =>
              saved &&
              begin(() => dispatch({ type: "resume", progress: saved }))
            }
          />
        ) : (
          <Stage
            key={`stage-${state.deaths}`}
            progress={state}
            blocked={overlay !== null || status.kind !== "playing"}
            talking={
              overlay?.kind === "dialog" &&
              overlay.lines[overlay.index].speaker === META.player
            }
            holding={state.selectedItem !== null}
            onUse={(id) => dispatch({ type: "clickHotspot", id })}
            onUseItem={(item, id) => dispatch({ type: "useItem", item, id })}
          />
        )}

        {overlay?.kind === "dialog" && (
          <DialogBox
            key={`${overlay.index}-${overlay.lines[overlay.index].text}`}
            line={overlay.lines[overlay.index]}
            onNext={() => dispatch({ type: "advanceDialog" })}
          />
        )}
        {overlay?.kind === "choice" && (
          <ChoiceBox
            prompt={overlay.prompt}
            options={overlay.options}
            onChoose={(index) => dispatch({ type: "choose", index })}
          />
        )}
        {overlay?.kind === "puzzle" && (
          <PuzzleView
            view={puzzleViews[puzzles[overlay.puzzle].kind]}
            puzzle={overlay.puzzle}
            failed={overlay.failed}
            onSubmit={(code) => dispatch({ type: "submitCode", code })}
            onClose={() => dispatch({ type: "closePuzzle" })}
          />
        )}
        {status.kind === "playing" && (
          <ItemToast key={`toast-${state.turn}`} items={state.gained} />
        )}
        {state.selectedItem && !overlay && (
          <ItemCursor item={state.selectedItem} stage={stage} />
        )}

        {status.kind === "dead" && (
          <EndCard
            tone="death"
            kicker="Game Over"
            title={deaths[status.death].title}
            text={deaths[status.death].text}
            tip={deaths[status.death].tip}
            art={<DeathScene villain={deaths[status.death].villain} />}
            actions={
              <>
                <CardButton primary onClick={() => dispatch({ type: "retry" })}>
                  Reintentar
                </CardButton>
                <CardButton onClick={toTitle}>Menú</CardButton>
              </>
            }
          />
        )}
        {status.kind === "ended" && (
          <EndCard
            tone={endings[status.ending].rank}
            kicker="Fin"
            {...endings[status.ending]}
            footer={endingFooter(state.deaths, state.flags)}
            actions={
              <>
                <CardButton
                  primary
                  onClick={() => dispatch({ type: "newGame" })}
                >
                  Jugar otra vez
                </CardButton>
                <CardButton onClick={toTitle}>Menú</CardButton>
              </>
            }
          />
        )}
      </div>
      <Inventory
        inventory={state.inventory}
        selected={state.selectedItem}
        combining={combining}
        onToggleCombine={() => setCombining(!combining)}
        onHover={setHoveredItem}
        onSelect={(item) => {
          // In combine mode the second pick merges the two items.
          if (combining && state.selectedItem && state.selectedItem !== item) {
            dispatch({ type: "combine", a: state.selectedItem, b: item });
            setCombining(false);
            return;
          }
          dispatch({ type: "selectItem", item });
        }}
        onCombine={(a, b) => {
          dispatch({ type: "combine", a, b });
          setCombining(false);
        }}
      />
    </div>
  );
}

type PuzzleViewProps = Parameters<typeof Keypad>[0] & { view: typeof Keypad };

function PuzzleView({ view: View, ...props }: PuzzleViewProps) {
  return <View {...props} />;
}

const EGGS = META.eggs;

function endingFooter(deathCount: number, flags: readonly string[]) {
  const died =
    deathCount === 0
      ? "Sin morir ni una vez. Leyenda."
      : `Moriste ${deathCount} ${deathCount === 1 ? "vez" : "veces"} en el camino.`;
  const found = EGGS.filter((egg) => flags.includes(egg)).length;
  return `${died} Caramelos escondidos: ${found}/${EGGS.length}.`;
}
