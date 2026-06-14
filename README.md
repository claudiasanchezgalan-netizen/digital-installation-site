# Digital Installation Site (TFG)

Proyecto web minimalista para la instalación **"Más allá de lo visible"**.

## Estructura

- `index.html`: estructura completa de la web.
- `styles.css`: diseño visual, tipografía y responsive.
- `main.js`: flujo de intro en dos pasos + animaciones suaves.
- `assets/`: imágenes y recursos.

## Flujo de acceso

1. Pantalla inicial: título + botón `Acceder`.
2. Pantalla umbral: imagen principal + 3 preguntas de identidad.
3. Tras completar campos y pulsar `Acceder`, aparece el sitio principal.

## Cómo editar contenido rápido

1. Imagen del umbral:
   - Archivo actual: `assets/threshold-image.png`
   - Reemplázalo por otra imagen si lo necesitas (mantén el mismo nombre para no tocar código).
2. Vídeo principal de instalación:
   - Busca `VIDEO_ID_MAIN` en `index.html` y sustituye por el ID real de YouTube.
3. Índice de capítulos:
   - Edita los textos dentro de `<aside class="chapter-index">` en `index.html`.
4. Google Form:
   - Busca `FORM_ID` y reemplaza por el ID real del formulario.
5. Galería:
   - Sustituye los bloques `<figure class="tile">` por imágenes reales (`assets/...`).

## Fuentes

- Base: Helvetica (sistema)
- Expresiva: Ballet (Google Fonts)

## Ejecutar local

Abre `index.html` directamente en navegador, o usa servidor local:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000/digital-installation-site/`.
