import { HexColorPicker } from "react-colorful";

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
  return (
    <div className="fixed top-0 w-full bg-gray-700 text-white flex items-center px-4 py-2 gap-3 z-20">
      <span className="text-xl font-semibold w-36">{tool}</span>

      <button
        onClick={() => setTool("Brush")}
        className="fas fa-brush text-white hover:text-yellow-300"
        title="Brush"
      />
      <div className="flex items-center gap-2">
        <HexColorPicker color={brushColor} onChange={setBrushColor} />
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

      <HexColorPicker
        color={bucketColor}
        onChange={(color) => {
          setBucketColor(color);
          setTool("Bucket Fill");
        }}
      />

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
