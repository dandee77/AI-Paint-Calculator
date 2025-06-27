import { useState, useRef, useEffect } from "react";
import ColorPickerPopover from "./ColorPickerPopover";

export default function TopBar({
  tool,
  setTool,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  bucketColor,
  setBucketColor,
  onClearCanvas,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onClearStorage,
  onDownload,
  status,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const brushRef = useRef();
  const bucketRef = useRef();
  const menuRef = useRef();

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      // Only close if click is outside the menu (and not on color pickers)
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const tools = (closeMenu) => (
    <>
      <button
        onClick={(e) => {
          setTool("Brush");
          if (closeMenu) closeMenu();
        }}
        className="fas fa-brush text-2xl text-gray-900 bg-white rounded px-2 py-1 hover:bg-purple-200 hover:text-purple-700 transition"
        title="Brush"
        type="button"
      />
      <div
        className="flex items-center gap-2 bg-gray-700 rounded px-2 py-1 shadow"
        ref={brushRef}
      >
        <ColorPickerPopover color={brushColor} onChange={setBrushColor} />
        <input
          type="number"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(+e.target.value)}
          className="w-12 text-center font-mono font-bold rounded bg-gray-200 text-gray-900 border-none outline-none px-1 py-0.5 mx-1"
        />
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(+e.target.value)}
          className="w-28 accent-gray-900"
        />
      </div>
      <div
        className="flex items-center bg-gray-700 rounded px-2 py-1 shadow gap-2"
        ref={bucketRef}
      >
        <ColorPickerPopover color={bucketColor} onChange={setBucketColor} />
      </div>
      <button
        onClick={(e) => {
          setTool("Eraser");
          if (closeMenu) closeMenu();
        }}
        className="fas fa-eraser text-2xl text-gray-900 bg-white rounded px-2 py-1 hover:bg-purple-200 hover:text-purple-700 transition"
        title="Eraser"
        type="button"
      />
      <button
        onClick={(e) => {
          onClearCanvas();
          if (closeMenu) closeMenu();
        }}
        className="text-lg font-bold text-gray-900 bg-white rounded px-3 py-1 hover:bg-red-200 hover:text-red-700 transition"
        title="Clear Canvas"
        type="button"
      >
        Clear
      </button>
      <button
        onClick={(e) => {
          onUndo();
          if (closeMenu) closeMenu();
        }}
        className="fas fa-undo text-2xl text-gray-900 bg-white rounded px-2 py-1 hover:bg-blue-200 hover:text-blue-700 transition"
        title="Undo"
        type="button"
      />
      <button
        onClick={(e) => {
          onRedo();
          if (closeMenu) closeMenu();
        }}
        className="fas fa-redo text-2xl text-gray-900 bg-white rounded px-2 py-1 hover:bg-blue-200 hover:text-blue-700 transition"
        title="Redo"
        type="button"
      />
      <button
        onClick={(e) => {
          onSave();
          if (closeMenu) closeMenu();
        }}
        className="fas fa-download text-2xl text-gray-900 bg-white rounded px-2 py-1 hover:bg-green-200 hover:text-green-700 transition"
        title="Save to LocalStorage"
        type="button"
      />
      <button
        onClick={(e) => {
          onLoad();
          if (closeMenu) closeMenu();
        }}
        className="fas fa-upload text-2xl text-gray-900 bg-white rounded px-2 py-1 hover:bg-blue-200 hover:text-blue-700 transition"
        title="Load from LocalStorage"
        type="button"
      />
      <button
        onClick={(e) => {
          onClearStorage();
          if (closeMenu) closeMenu();
        }}
        className="fas fa-trash-alt text-2xl text-gray-900 bg-white rounded px-2 py-1 hover:bg-red-200 hover:text-red-700 transition"
        title="Clear Storage"
        type="button"
      />
      <button
        onClick={(e) => {
          onDownload();
          if (closeMenu) closeMenu();
        }}
        className="far fa-save text-2xl text-gray-900 bg-white rounded px-2 py-1 hover:bg-purple-200 hover:text-purple-700 transition"
        title="Download Image"
        type="button"
      />
    </>
  );

  return (
    <div className="fixed top-0 w-full flex items-center px-4 py-2 gap-3 z-20 bg-gray-500/90 backdrop-blur shadow-lg border-b border-gray-400">
      {/* Tool classifier always visible */}
      <span className="text-2xl font-mono font-bold font-[Oswald] tracking-wide text-white bg-gray-700 rounded-lg px-4 py-1 mr-2 shadow min-w-[120px] text-center">
        {status ? status : tool === "Eraser" ? "Eraser" : "Brush"}
      </span>
      {/* Desktop tools */}
      <div className="flex-1 flex justify-end items-center gap-3">
        {/* Show tools inline for screens wider than 1000px (custom breakpoint) */}
        <div className="hidden [@media(min-width:1000px)]:flex items-center gap-3">
          {tools()}
        </div>
        {/* Burger menu for screens less than 1000px or square screens */}
        <div className="[@media(min-width:1000px)]:hidden relative">
          <button
            className="fas fa-bars text-3xl text-white px-2 py-1 rounded hover:bg-gray-700 transition"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
            type="button"
          />
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 bg-gray-700 rounded shadow-lg flex flex-col gap-2 p-3 z-50 min-w-[250px]"
              ref={menuRef}
            >
              {tools(() => setMenuOpen(false))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
