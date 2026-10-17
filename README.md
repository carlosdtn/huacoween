# Huacoween: Pollo a la Brasa del Más Allá

Un escape point-and-click de Halloween, tenebroso y chistoso, en pixel art. Homenaje a los juegos de humor negro de Inkagames.

Es 31 de octubre. Tito, repartidor de la app Rapidito, recoge un pedido a las 23:57 y queda encerrado en la cocina de la pollería La Brasa Eterna. En la tele aparece **Huacosaw**, un huaco moche maldito con cachetes en espiral que maneja un triciclo:

> «Hola, Tito. Quiero jugar un juego. Durante años te comiste las papas fritas de tus clientes…»

El castigo: entregar un cuarto de pollo a **Don Eusebio**, que murió en 1999 esperando su pedido. Si Tito no llega antes del amanecer, será repartidor fantasma por toda la eternidad. Con una estrella.

## Jugar

```bash
bun install
bun run dev
```

Abre http://localhost:3000.

- Haz clic en el piso para caminar, y en objetos o personajes para que Tito vaya a usarlos.
- Selecciona un ítem del inventario y haz clic en la escena para usarlo, o arrástralo encima.
- Para combinar, usa el botón **Combinar** o arrastra un ítem sobre otro.
- Algunos objetos se pueden dejar en lugares sin marca. Nada te avisa cuáles.
- El foco 💡 da una pista según tu avance. Espacio o Enter avanza los diálogos.

### Lo que hay

- **8 escenarios**: la cocina de la pollería, Jr. Las Ánimas, el Mercado de las Brujas, unas catacumbas, el Parque de los Lamentos, la puerta del Cementerio Jardines del Más Acá, el pabellón San Judas Tadeo y el mausoleo de Don Eusebio.
- **Personajes**: Chicharrón (un cuy que te sigue), Hermana Lucha la curandera, Doña Pocha la anticuchera fantasma, el Muqui, el Chullachaqui, el Tunche, la Banda Los Difuntos, un condenado y Don Eusebio.
- **Puzzles**: dos teclados, un huayno al estilo Simon, combinaciones y elecciones.
- **Muertes**: 12, cada una con el villano riéndose, un chiste y un consejo.
- **Caramelos escondidos**: 5.
- **Finales**: 3 (cinco, tres y una estrella).

El diseño completo está en [GDD.md](GDD.md).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `bun run dev` | Servidor de desarrollo |
| `bun run build` | Build de producción |
| `bun run check` | Biome, TypeScript y tests |
| `bun run format` | Formatea y ordena imports con Biome |
| `bun scripts/preview.ts scene kitchen out.png` | Renderiza un escenario a PNG sin navegador |
| `bun scripts/preview.ts sprites out.png` | Hoja con todos los sprites |

## Estructura

```
src/
  game/
    types.ts            Tipos del dominio: condiciones, efectos, hotspots
    content/            Todo el juego como datos: escenas, ítems, puzzles, finales
      meta.ts           Título, jugador, villano, compañero y caramelos
      dsl.ts            Helpers para escribir escenas como guion (say, pickup, travel…)
      scenes/           Una escena por archivo
    engine/             Lógica pura, sin React
      reducer.test.ts   Recorre el juego completo hasta cada final
  components/
    pixel/              Canvas del escenario, sprites en React, retratos
    game/               Inventario, diálogos, teclado, ritmo, pantallas finales
  pixel/                Paleta, constructor de sprites, fondos, fuente y registro de arte
  audio/                Sonidos y música sintetizados con Web Audio
```

El motor no sabe nada de la historia y el contenido no sabe nada de React. Una escena es una lista de hotspots; cada hotspot tiene interacciones (`with` un ítem, `when` una condición) que producen efectos (`say`, `give`, `take`, `set`, `goto`, `puzzle`, `choice`, `die`, `end`, `branch`).

En desarrollo, `window.__TEST__` expone `state` y `dispatch` para playtests automáticos.

## Arte

Todo el arte es pixel art original, hecho en código, sobre un escenario de **480×270**:

- **Paleta** en `src/pixel/palette.ts`: 50 colores, cada uno con una letra.
- **Sprites** en `src/pixel/sprites/`: se dibujan con el constructor de `src/pixel/builder.ts` (cajas, círculos, polígonos, trazos, sombreado y contorno automático).
- **Fondos** en `src/pixel/scenes/`: degradados con dithering, ladrillos, neblina, velas y murciélagos, con una capa animada por escena.
- **Galería**: abre `/sprites` para ver cada sprite grande y animado.

## Créditos

- **Arte, sonido y música**: originales, sin assets de terceros. La música son tres temas chiptune: «Huayno de Huacosaw», «Festejo de las ánimas» y «El panteón duerme».
- **Fuentes**: Silkscreen y Pixelify Sans (SIL Open Font License).
- **Íconos del HUD**: Lucide (ISC), vía `react-icons`.
- **Inspiración**: las leyendas peruanas del Tunche, el Chullachaqui, el Muqui y los condenados.

Huacosaw, Tito y Chicharrón son personajes originales. El juego es un homenaje al género de Inkagames, sin usar sus personajes ni su arte.
