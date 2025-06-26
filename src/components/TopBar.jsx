import { HexColorPicker } from "react-colorful";
import { useState, useRef, useEffect } from "react";

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
  onSave,
  onLoad,
  onClearStorage,
  onDownload,
}) {
  const [showBrushPicker, setShowBrushPicker] = useState(false);
  const [showBucketPicker, setShowBucketPicker] = useState(false);
  const brushRef = useRef();
  const bucketRef = useRef();

  // Hide color pickers when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (
        brushRef.current &&
        !brushRef.current.contains(e.target) &&
        bucketRef.current &&
        !bucketRef.current.contains(e.target)
      ) {
        setShowBrushPicker(false);
        setShowBucketPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="fixed top-0 w-full bg-gray-700 text-white flex items-center px-4 py-2 gap-3 z-20">
      <span className="text-xl font-semibold w-36">{tool}</span>

      <button
        onClick={() => setTool("Brush")}
        className="fas fa-brush text-white hover:text-yellow-300"
        title="Brush"
      />

      <div className="flex items-center gap-2" ref={brushRef}>
        <button
          className="w-8 h-8 rounded-full border-2 border-white shadow"
          style={{ background: brushColor }}
          onClick={() => setShowBrushPicker((v) => !v)}
          title="Brush Color"
        />
        {showBrushPicker && (
          <div className="absolute mt-12 z-30">
            <HexColorPicker
              color={brushColor}
              onChange={(color) => {
                setBrushColor(color);
              }}
            />
          </div>
        )}
        <span className="w-10 text-center">{brushSize}</span>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(+e.target.value)}
          className="w-24"
        />
      </div>

      <button
        onClick={() => setTool("Eraser")}
        className="fas fa-eraser text-white hover:text-yellow-300"
        title="Eraser"
      />

      <div className="flex items-center" ref={bucketRef}>
        <button
          className="w-8 h-8 rounded-full border-2 border-white shadow"
          style={{ background: bucketColor }}
          onClick={() => setShowBucketPicker((v) => !v)}
          title="Bucket Fill Color"
        />
        {showBucketPicker && (
          <div className="absolute mt-12 z-30">
            <HexColorPicker
              color={bucketColor}
              onChange={(color) => {
                setBucketColor(color);
                setTool("Bucket Fill");
              }}
            />
          </div>
        )}
      </div>

      <button
        onClick={onClearCanvas}
        className="fas fa-undo-alt"
        title="Clear"
      />
      <button
        onClick={onSave}
        className="fas fa-download"
        title="Save to LocalStorage"
      />
      <button
        onClick={onLoad}
        className="fas fa-upload"
        title="Load from LocalStorage"
      />
      <button
        onClick={onClearStorage}
        className="fas fa-trash-alt"
        title="Clear Storage"
      />
      <button
        onClick={onDownload}
        className="far fa-save"
        title="Download Image"
      />
    </div>
  );
}
