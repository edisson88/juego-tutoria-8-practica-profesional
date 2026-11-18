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

- `index.html` e `inicio.css`: portada de los dos juegos.
- `lider/` y `tribunal/`: proyectos estáticos independientes. Cada carpeta incluye `index.html`, `game.css`, `game.js`, `story.js` y `scene.png`.
- `story.js`: historias, alternativas, consecuencias, rutas y presentación del rol.
- `game.js`: interfaz, sellos, credencial, guardado local y reflexión para desbloquear recompensas.
- `game.css`: estilo visual, adaptación a pantallas pequeñas e impresión.
- `.nojekyll`: desactiva el procesamiento Jekyll. Consérvalo si subes el proyecto con Git.

## Funciones incluidas

- Historias de tres capítulos con ramificaciones según las decisiones.
- Alternativas con orden aleatorio y consecuencias contextuales de simulación.
- Puntos vinculados a la decisión, no al azar.
- Colección de tres sellos y credencial simbólica imprimible.
- Reflexión escrita cuando una decisión obtiene menos de 100 puntos: mínimo 40 caracteres y 8 palabras. Se verifica la extensión, no el significado ni la calidad del texto.
- Guardado del avance y las reflexiones en el navegador, por separado para cada juego.
- Introducción de rol y enfoque antes de empezar; confirmación antes de reiniciar.

## Datos y condiciones de uso

El proyecto no incluye servicios de autenticación, analítica ni envío de información. En GitHub Pages los enlaces no pedirán iniciar sesión con ChatGPT. El código y las imágenes están incluidos; no dependen de los enlaces privados usados durante el desarrollo.

Las reflexiones y la partida se conservan en `localStorage`, en ese navegador y dispositivo. No se envían a la docente ni se comparten con otros estudiantes. No incluyas datos personales reales. Borrar los datos del navegador o reiniciar una partida elimina ese avance. Al pasar de las versiones anteriores a GitHub Pages, el progreso no se transfiere porque cambia el origen del sitio.

Las situaciones son ficticias y la credencial es simbólica, no una certificación profesional. Las rutas éticas requieren revisión académica del contexto y protocolo institucional. El contenido toma como referencia las leyes colombianas 1090 y 1098 de 2006; el juego no sustituye la valoración ni el acompañamiento profesional.

La aplicación es estática y no usa un tablero compartido ni servidor de resultados. La capacidad para 400 participantes simultáneos no ha sido validada con una prueba de carga.

## Verificaciones realizadas en esta entrega

- Sintaxis JavaScript y referencias relativas a archivos locales.
- Conservación de historias y reflexión de las versiones publicadas.
- Separación de datos por juego; ausencia de credenciales, Git interno y configuración privada de Sites en el ZIP.

Publicar en tu cuenta de GitHub y revisar la URL final queda pendiente de que subas los archivos. Esta entrega no crea un repositorio ni modifica tu cuenta.
