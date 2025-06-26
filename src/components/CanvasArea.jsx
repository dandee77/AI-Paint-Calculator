import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const CanvasArea = forwardRef(function CanvasArea(
  { brushColor, brushSize, bucketColor, tool, setTool },
  ref
) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [drawnArray, setDrawnArray] = useState([]);

  useImperativeHandle(ref, () => ({
    clear,
    save,
    load,
    clearStorage,
    download,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
    // Only fill background and redraw lines, do not clear drawnArray
    ctx.fillStyle = bucketColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (drawnArray.length > 1) {
      for (let i = 1; i < drawnArray.length; i++) {
        ctx.beginPath();
        ctx.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
        ctx.lineWidth = drawnArray[i].size;
        ctx.strokeStyle = drawnArray[i].eraser
          ? bucketColor
          : drawnArray[i].color;
        ctx.lineTo(drawnArray[i].x, drawnArray[i].y);
        ctx.stroke();
      }
    }
  }, [bucketColor, drawnArray]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDraw = (e) => {
    setDrawing(true);
    const { x, y } = getPos(e);
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === "Eraser" ? bucketColor : brushColor;
  };

  const draw = (e) => {
    if (!drawing) return;
    const { x, y } = getPos(e);
    const ctx = ctxRef.current;
    ctx.lineTo(x, y);
    ctx.stroke();
    setDrawnArray((prev) => [
      ...prev,
      {
        x,
        y,
        size: brushSize,
        color: tool === "Eraser" ? bucketColor : brushColor,
        eraser: tool === "Eraser",
      },
    ]);
  };

  const stopDraw = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.fillStyle = bucketColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setDrawnArray([]);
    setTool("Brush");
  };

  const save = () => {
    localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
  };

  const load = () => {
    const saved = localStorage.getItem("savedCanvas");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDrawnArray(parsed);
      restore(parsed);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem("savedCanvas");
  };

  const download = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 1);
    link.download = "paint-example.jpeg";
    link.click();
  };

  const restore = (lines) => {
    const ctx = ctxRef.current;
    clear();
    for (let i = 1; i < lines.length; i++) {
      ctx.beginPath();
      ctx.moveTo(lines[i - 1].x, lines[i - 1].y);
      ctx.lineWidth = lines[i].size;
      ctx.strokeStyle = lines[i].eraser ? bucketColor : lines[i].color;
      ctx.lineTo(lines[i].x, lines[i].y);
      ctx.stroke();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-[50px] z-10 cursor-crosshair bg-gray-300"
      onMouseDown={startDraw}
      onMouseMove={draw}
      onMouseUp={stopDraw}
      onMouseLeave={stopDraw}
    />
  );
});

export default CanvasArea;
