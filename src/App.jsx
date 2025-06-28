import { useState, useRef, useEffect } from "react";
import TopBar from "./components/TopBar";
import CanvasArea from "./components/CanvasArea";
import Loading from "./components/Loading";
import Modal from "./components/Modal";

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
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // --- AI SEND BUTTON LOGIC ---
  const handleSendToAI = () => {
    if (
      !canvasRef.current ||
      typeof canvasRef.current.getCanvasElement !== "function"
    )
      return;
    const realCanvas = canvasRef.current.getCanvasElement();
    if (!realCanvas || typeof realCanvas.toBlob !== "function") return;
    setIsLoading(true);
    realCanvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "canvas.png");
      formData.append("dict_of_vars", JSON.stringify({}));
      try {
        const res = await fetch("http://localhost:8000/solve", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setAiResult(data.result || data.error || "No result");
        setModalOpen(true);
      } catch (err) {
        setAiResult("AI API error: " + err.message);
        setModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, "image/png");
  };

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
        onSendToAI={handleSendToAI}
      />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-75">
          <Loading />
        </div>
      )}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        result={aiResult}
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
