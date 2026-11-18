# Tutoría 8 · Laboratorio de decisiones

Proyecto estático listo para GitHub Pages. Incluye inicio y dos juegos con URLs independientes dentro del mismo repositorio. No requiere Node.js, compilación, API, claves ni bases de datos.

## Publicar en GitHub Pages

1. Descomprime el ZIP en tu computador.
2. Crea un repositorio en GitHub, por ejemplo `tutoria8-juegos`. Usa uno público si trabajas con GitHub Free.
3. Sube **el contenido descomprimido** a la raíz del repositorio. `index.html`, `inicio.css`, `lider/` y `tribunal/` deben quedar directamente en la raíz, no dentro de otra carpeta. No subas solamente el ZIP.
4. Guarda los cambios en la rama `main`.
5. Abre **Settings → Pages**.
6. En **Build and deployment → Source**, selecciona **Deploy from a branch**.
7. Selecciona **main** y **/(root)**. Pulsa **Save**.
8. Espera a que GitHub termine la publicación. En Pages aparecerá la URL real del sitio.

Referencia oficial: https://docs.github.com/es/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Las tres direcciones

Si tu usuario es `USUARIO` y tu repositorio es `tutoria8-juegos`, las direcciones tendrán este formato (son ejemplos, no sitios ya publicados):

| Página | URL de ejemplo |
| --- | --- |
| Inicio | `https://USUARIO.github.io/tutoria8-juegos/` |
| Líder transformacional | `https://USUARIO.github.io/tutoria8-juegos/lider/` |
| Tribunal ético | `https://USUARIO.github.io/tutoria8-juegos/tribunal/` |

Los juegos pueden abrirse directamente, sin pasar por el inicio. Los enlaces relativos funcionan también si renombras el repositorio. No necesitan dominios separados.

## Probar antes de publicar

Desde esta carpeta, si tienes Python instalado:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000/`. También puedes usar Live Server de Visual Studio Code.

## Archivos que puedes editar

- `index.html` e `inicio.css`: portada de los dos juegos (los números 10 capítulos / 10 sellos / 1000 XP están escritos a mano aquí).
- `lider/` y `tribunal/`: proyectos estáticos independientes (`index.html`, `game.css`, `game.js`, `story.js`, `scene.png`).
- `story.js` (distinto en cada juego): todo el contenido en `window.GAME`: textos, capítulos, escenas, alternativas, puntos, efectos sobre las variables, ejes del cierre y desenlaces. **El número de capítulos y el máximo de puntos salen de `chapters.length`** (máximo = capítulos × 100).
- `game.js` (idéntico en ambas carpetas; si lo cambias, cópialo a la otra): interfaz, sellos, reflexión, guardado, credencial.
- `tests_check.js`: verificación estructural y de flujo. Ejecuta `node tests_check.js` (solo Node, sin dependencias).
- `.nojekyll`: consérvalo si subes con Git.

## Cómo funciona la historia ampliada

- Diez capítulos por juego = diez decisiones por partida. Cada capítulo tiene una o varias escenas; la escena que ves depende de tus decisiones y de las variables de estado (las rutas se reconectan, pero las variables recuerdan lo ocurrido). Los capítulos 4 a 9 tienen una escena «regular» y otra de «recuperación o tensión» según el estado.
- Variables (recursos ficticios del juego, no mediciones psicológicas), de 0 a 6:
  - Liderazgo: confianza, colaboración, sobrecarga, acuerdos vigentes.
  - Tribunal: reserva pertinente, consulta con supervisión, comunicación con el adolescente, acciones pendientes.
- Puntos: dependen solo de la alternativa elegida (máximo 100 por capítulo, 1000 por juego). El azar solo elige entre dos variantes de contexto (70 % / 30 %, probabilidades de diseño, no predicciones).
- El desenlace combina puntos, número de decisiones débiles, decisiones críticas (0 puntos), recuperación en los capítulos finales y el estado de las variables; no depende solo de la suma. El cierre relaciona el recorrido con las cuatro dimensiones del liderazgo transformacional (Líder) o con cuatro ejes de criterio ético (Tribunal) y propone acciones concretas. No diagnostica ni es una prueba validada.

### Capítulos de «Misión: líder transformacional»
1 Abrir el diálogo · 2 Construir acuerdos · 3 Aprender juntos · 4 Equidad en las cargas · 5 Apertura al cambio · 6 Voces incluidas · 7 Integridad ante la presión · 8 Diálogo abierto · 9 Cuidado del equipo · 10 Huella sostenible.

### Capítulos de «Tribunal de decisiones éticas»
1 Recibir el relato · 2 Deliberar con criterio · 3 Fundamentar la actuación · 4 Información e incertidumbre · 5 Consulta supervisada · 6 Destinatarios de la información · 7 Documentar · 8 Comunicación con el adolescente · 9 Integridad institucional · 10 Seguimiento y revisión.

El Tribunal distingue los hechos originales del caso (panel «Hechos originales del caso») de la información ficticia añadida (recuadro morado «Información añadida por la simulación»).

## Sellos, reflexión y credencial

- Diez sellos por juego. Con 100 puntos el sello se reclama directamente; con menos hay que escribir una reflexión (mínimo 40 caracteres y 8 palabras; es una comprobación de extensión, no de calidad) y no cambia la puntuación. La pregunta de reflexión es propia de cada capítulo y muestra tu decisión.
- Un solo punto del código marca un sello como reunido y exige la reflexión. La credencial exige los diez sellos.
- El texto del estudiante se muestra siempre con `textContent`.

## Guardado y compatibilidad

- Clave `tutoria8-<juego>-v2`, independiente por juego. Se guarda solo el historial de decisiones (escena, alternativa, variante, sello reclamado, reflexión); puntos, variables y progreso se recalculan y se validan contra la historia. Si el guardado no coincide con la historia (por ejemplo, tras editar `story.js`), se rechaza.
- Las partidas antiguas de tres capítulos (`…-visual-v1`) no son compatibles: el juego avisa y ofrece empezar una nueva. **No se borran hasta que la persona confirma** «Reiniciar».

## Funciones incluidas

- Introducción de rol, alternativas en orden aleatorio, consecuencias contextuales, bitácora de decisiones, credencial simbólica imprimible, confirmación antes de reiniciar.
- Duración estimada: 35–50 minutos. **Es una estimación pendiente de pilotaje** (ya no se promete 5–7 minutos).

## Datos y condiciones de uso

El proyecto no incluye servicios de autenticación, analítica ni envío de información. Las reflexiones y la partida se conservan en `localStorage`, en ese navegador y dispositivo; no se envían a la docente. No incluyas datos personales reales. Borrar los datos del navegador o reiniciar elimina ese avance.

Las situaciones son ficticias y la credencial es simbólica, no una certificación profesional. El juego no sustituye la valoración ni el acompañamiento profesional. La capacidad para 400 participantes simultáneos no ha sido validada con una prueba de carga.

## Verificaciones realizadas

Ejecutadas con `node tests_check.js` (simula el motor con un DOM falso, no un navegador):
- Recorrido de las 59 049 rutas posibles por juego: todas terminan tras exactamente 10 decisiones, sin escenas inexistentes ni inalcanzables; probabilidades suman 100; puntos 0–100 por decisión; la ruta perfecta suma 1000.
- Segunda respuesta ignorada (sin doble puntuación); sello bloqueado sin reflexión o con reflexión insuficiente; recarga con sello pendiente y tras reclamarlo; credencial bloqueada sin diez sellos; partida alterada rechazada; partida v1 detectada sin borrarla; claves separadas por juego.

**Pendiente (no ejecutado):** prueba visual en navegador real y en celular (la colección de diez sellos usa CSS grid adaptable, sin revisar visualmente), impresión de la credencial, funcionamiento desde las URL publicadas en GitHub Pages, y pilotaje con estudiantes para la duración.

## Pendientes de revisión académica (normativa)

La verificación en fuente oficial no fue posible (los sitios del Senado y de Función Pública no respondieron durante la elaboración). Por eso el Tribunal **solo nombra la Ley 1090 de 2006 y la Ley 1098 de 2006, sin citar artículos**, y evita afirmar rutas, autoridades o excepciones específicas. Debe revisar la docente, contra el texto oficial:
- Alcance y excepciones de la reserva profesional del psicólogo (Ley 1090) aplicables a un practicante.
- Deberes de reporte y autoridad competente ante posible maltrato de niños, niñas y adolescentes (Ley 1098) y cómo se concretan en el protocolo de una fundación.
- Qué debe contener un registro y quién puede acceder, según la normativa y el protocolo institucional.
- Que el caso ficticio de la «coordinadora de reemplazo», la llamada de un familiar y la presión de la dirección sean coherentes con las rutas reales.
