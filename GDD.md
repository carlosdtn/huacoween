# Huacoween: Pollo a la Brasa del Más Allá — GDD

## Pitch

Escape point-and-click de Halloween, tenebroso y chistoso, en la tradición de los juegos de humor negro de Inkagames. Tito, repartidor de la app Rapidito, recoge un pedido a las 23:57 del 31 de octubre y queda encerrado en la cocina de una pollería. En la tele de la pared aparece **Huacosaw**, un huaco retrato moche con cachetes en espiral que maneja un triciclo:

> «Hola, Tito. Quiero jugar un juego. Durante años te comiste las papas fritas de tus clientes…»

El castigo: entregar un cuarto de pollo a la brasa a **Don Eusebio**, un cliente que murió en 1999 esperando su pedido. Si no llega antes del amanecer del Día de Todos los Santos, Tito será repartidor fantasma por toda la eternidad. Con una estrella.

## Referencias

- **Inkagames**: escapes cómicos con un villano estilo Saw que habla por una tele, muertes absurdas con chiste y consejo, varios finales.
- **Leyendas peruanas** (Lifeder, Andina): el Tunche, que silba en la noche y no hay que responderle; el Chullachaqui, que toma la forma de un pariente para que lo sigas y te pierdas, y se delata por sus pies desiguales; el Muqui, duende de las minas que esconde herramientas; los condenados; los gallinazos de Lima.
- **Costumbres**: limpia de huevo y agua florida de las curanderas, bandas que tocan en los cementerios el 1 de noviembre, el pollo a la brasa con sus cremas.

## Stack

Next.js 16, React 19, canvas con pixel art hecho en código, Web Audio, Bun y Biome. El motor no sabe nada de la historia: todo el contenido son datos.

- Resolución interna **480×270**, para un pixel fino.
- Paleta de 50 colores con una letra cada uno.

## Mecánicas

| Mecánica | Ejemplo en Huacoween |
| --- | --- |
| Caminar con clic y usar hotspots | Tito camina hasta el asador antes de usarlo |
| Inventario, usar ítem en escena, arrastrar | Pinzas → asador |
| Combinar ítems | Pollo + papas = pedido; manguera + botella = sifón |
| Dejar ítems en lugares sin marca | La lechuga en el piso atrae a Chicharrón |
| Compañero que te sigue | Chicharrón, un cuy que escapó de la carta |
| Teclado de código | Puerta de la cocina (1990), mausoleo (1999) |
| Ritmo tipo Simon | El huayno de la banda de esqueletos |
| Elecciones con muerte | Silbarle al Tunche, seguir al Chullachaqui |
| Muertes con villano, chiste y consejo | 12 muertes |
| Pistas por progreso | Botón 💡 |
| Huevos de pascua | 5 |
| Finales | 3: cinco, tres y una estrella |

## Escenarios

1. **Pollería La Brasa Eterna, cocina (23:57)**: asador giratorio, freidora, mostrador con cremas, caja registradora, cocina, refri, lavadero con un cuy escondido, pizarra con precios, tele con Huacosaw, puerta con teclado.
2. **Jr. Las Ánimas (00:31)**: la moto «La Chancha» sin gasolina, Doña Pocha (anticuchera fantasma), un callejón donde silba el Tunche, gallinazo en el poste, calabazas.
3. **Mercado de las Brujas (01:13)**: Hermana Lucha (curandera), jaulas de cuyes, puesto de hierbas y sapos secos, trampilla a las catacumbas.
4. **Catacumbas (01:48)**: círculos de huesos, el Muqui, un hueco en la pared de calaveras, el túnel «que llega hasta el Callao».
5. **Parque de los Lamentos (02:22)**: el Chullachaqui disfrazado de la mamá de Tito, una mototaxi abandonada, banca y pileta seca.
6. **Cementerio Jardines del Más Acá, puerta (03:33)**: la banda de esqueletos sin su maza de bombo, nido de gallinazo, la reja.
7. **Pabellón San Judas Tadeo (04:04)**: lápidas con epitafios chistosos, la tumba del huaquero Pancracio, un condenado, el mausoleo de los Quispe.
8. **Mausoleo de Don Eusebio (04:44)**: Huacosaw bloquea el nicho. Jefe final y entrega.

## Recorrido principal

1. Cocina: mandil → llavecita → cajón → pinzas → pollo. Freidora → (no comer) → papas. Combinar pedido. Cremas, sol, encendedor, lechuga, huevo. Lechuga en el piso → Chicharrón. Puerta 1990.
2. Calle: sol → Doña Pocha → anticucho. Callejón → entrar sin hacer ruido → botella.
3. Mercado: Lucha pide un huevo → lo lee → agua florida y la pista del nombre. Trampilla con el encendedor.
4. Catacumbas: anticucho al Muqui → Chicharrón entra al hueco → maza.
5. Parque: mirar los pies de «mamá» con el encendedor → el Chullachaqui huye y deja la manguera. Manguera + botella → sifón → gasolina de la mototaxi.
6. Calle: gasolina en la moto → cementerio.
7. Puerta: maza a la banda → huayno → reja abierta.
8. Pabellón: tumba del huaquero (el huaco se llama **Pepe**), placa de Eusebio (1931–1999), mausoleo 1999.
9. Mausoleo: agua florida a Huacosaw → «Pepe» → se calma. Pedido al nicho → final.

## Finales

- **Cinco estrellas** (bueno): entrega en la mano con las cremas.
- **Tres estrellas**: entrega en la mano sin cremas.
- **Una estrella**: dejar el pedido en el piso y marcar «entregado».

## Arte

Pixel art original en código, a 480×270. Personajes de unos 26×50 px, sombreado de dos o tres tonos, fondos con degradados con dithering y una capa animada por escena (brasa, neblina, velas, murciélagos).

## Audio

Tres temas chiptune: «Huayno de Huacosaw» (cocina y calle), «Festejo de las ánimas» (mercado y parque) y «El panteón duerme» (catacumbas y cementerio).

## Hitos

- **M1**: motor a 480×270, contenido completo como datos, tests del recorrido y de cada final.
- **M2**: pixel art de todos los escenarios, personajes e ítems.
- **M3**: playtest en navegador, README y repo público.

## Fuera de alcance

- Traducción al inglés.
- Voces grabadas.
- Guardado en la nube.
