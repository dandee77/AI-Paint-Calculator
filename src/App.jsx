import { useState, useRef, useEffect } from "react";
import TopBar from "./components/TopBar";
import CanvasArea from "./components/CanvasArea";

export default function App() {
  const [tool, setTool] = useState("Brush");
  const [brushColor, setBrushColor] = useState("#a51dab");
  const [brushSize, setBrushSize] = useState(10);
  const [bucketColor, setBucketColor] = useState("#ffffff");
  const canvasRef = useRef();

  const handleClearCanvas = () => canvasRef.current?.clear();
  const handleSave = () => canvasRef.current?.save();
  const handleLoad = () => canvasRef.current?.load();
  const handleClearStorage = () => canvasRef.current?.clearStorage();
  const handleDownload = () => canvasRef.current?.download();

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
        onSave={handleSave}
        onLoad={handleLoad}
        onClearStorage={handleClearStorage}
        onDownload={handleDownload}
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
