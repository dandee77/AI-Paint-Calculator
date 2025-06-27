# AI Paint Calculator

This is a modern, responsive paint app where you can draw math problems and (soon) get instant answers using Google Gemini AI. Features include brush/eraser tools, undo/redo, color pickers, save/load, image download, and a mobile-friendly UI.

## Features

- 🎨 **Paint & Erase**: Draw with a brush or eraser, choose brush size and color.
- 🪣 **Background Color**: Change the canvas background color.
- 🧹 **Clear, Undo, Redo**: Full undo/redo stack and clear canvas.
- 💾 **Save/Load**: Save your drawing to local storage and load it back.
- 🖼️ **Download**: Download your drawing as an image.
- 📱 **Responsive UI**: Modern top bar, burger menu for mobile/square screens.
- 🖌️ **Color Pickers**: Popover color pickers for brush and background.
- 🔔 **Status Messages**: Temporary status messages for actions (undo, save, etc).

## Planned (AI) Features

- ✨ **AI Math Solver**: Draw a math problem, send it to Google Gemini API, and get the answer displayed on the site.
- 📝 **Handwriting Recognition**: Recognize handwritten math expressions.

## Usage

1. **Draw**: Use the brush or eraser to draw on the canvas.
2. **Change Colors**: Click the color pickers to change brush or background color.
3. **Undo/Redo**: Use the undo/redo buttons to step through your drawing history.
4. **Save/Load**: Save your work to local storage and load it back later.
5. **Download**: Download your drawing as a PNG image.

## Development

### Install dependencies

```
npm install
```

### Run the app

```
npm run dev
```

### Build for production

```
npm run build
```

## File Structure

- `src/App.jsx` — Main app logic, status messages, tool state
- `src/components/TopBar.jsx` — Responsive top bar, tool actions, burger menu
- `src/components/CanvasArea.jsx` — Canvas drawing logic, undo/redo, resizing
- `src/components/ColorPickerPopover.jsx` — Popover color picker logic

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
