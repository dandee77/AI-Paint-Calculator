import { useState, useRef, useEffect } from "react";
import TopBar from "./components/TopBar";
import CanvasArea from "./components/CanvasArea";

// TODO: THE REDO DOES NOT BRING BACK THE CANVAS WHEN CLEARED NOT UNDOED
// TODO: ADD INDICATOR FOR THE BG COLOR WHEEL
// TODO: ADD BUCKET FILL TOOL FEATURE
// TODO: CANVAS BG DOES NOT GET SAVED OR LOADED

export default function App() {
  const [tool, setTool] = useState("Brush");
  const [brushColor, setBrushColor] = useState("#a51dab");
  const [brushSize, setBrushSize] = useState(10);
  const [bucketColor, setBucketColor] = useState("#ffffff");
  const [status, setStatus] = useState("");
  const statusTimeout = useRef();
  const canvasRef = useRef();

  const showStatus = (msg) => {
    setStatus(msg);
    if (statusTimeout.current) clearTimeout(statusTimeout.current);
    statusTimeout.current = setTimeout(() => setStatus(""), 800);
  };

  const handleClearCanvas = () => {
    canvasRef.current?.clear();
    showStatus("Cleared");
  };
  const handleUndo = () => {
    canvasRef.current?.undo();
    showStatus("Undo");
  };
  const handleRedo = () => {
    canvasRef.current?.redo();
    showStatus("Redo");
  };
  const handleSave = () => {
    canvasRef.current?.save();
    showStatus("Saved to local storage");
  };
  const handleLoad = () => {
    canvasRef.current?.load();
    showStatus("Loaded from local storage");
  };
  const handleClearStorage = () => {
    canvasRef.current?.clearStorage();
    showStatus("Cleared storage");
  };
  const handleDownload = () => {
    canvasRef.current?.download();
    showStatus("Downloaded");
  };

  return (
    <main className="h-screen w-screen overflow-hidden">
      <TopBar
        tool={tool}
        setTool={setTool}
        brushColor={brushColor}
        setBrushColor={setBrushColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        bucketColor={bucketColor}
        setBucketColor={setBucketColor}
        onClearCanvas={handleClearCanvas}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onLoad={handleLoad}
        onClearStorage={handleClearStorage}
        onDownload={handleDownload}
        status={status}
      />
      <CanvasArea
        ref={canvasRef}
        brushColor={brushColor}
        brushSize={brushSize}
        bucketColor={bucketColor}
        tool={tool}
        setTool={setTool}
      />
    </main>
  );
}
