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
  const [currentStroke, setCurrentStroke] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useImperativeHandle(ref, () => ({
    clear,
    save,
    load,
    clearStorage,
    download,
    undo,
    redo,
    getCanvasElement: () => canvasRef.current,
  }));

  useEffect(() => {
    function resizeAndRedraw() {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 50;
      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctxRef.current = ctx;

      ctx.fillStyle = bucketColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawnArray.forEach((stroke) => {
        if (stroke.length > 0) {
          ctx.beginPath();
          ctx.moveTo(stroke[0].x, stroke[0].y);
          ctx.lineWidth = stroke[0].size;
          ctx.strokeStyle = stroke[0].eraser ? bucketColor : stroke[0].color;
          for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i].x, stroke[i].y);
          }
          ctx.stroke();
        }
      });
    }
    resizeAndRedraw();
    window.addEventListener("resize", resizeAndRedraw);
    return () => window.removeEventListener("resize", resizeAndRedraw);
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

    setCurrentStroke([
      {
        x,
        y,
        size: brushSize,
        color: tool === "Eraser" ? bucketColor : brushColor,
        eraser: tool === "Eraser",
      },
    ]);
  };

  const draw = (e) => {
    if (!drawing) return;
    const { x, y } = getPos(e);
    const ctx = ctxRef.current;
    ctx.lineTo(x, y);
    ctx.stroke();

    setCurrentStroke((prev) => [
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

  const stopDraw = () => {
    if (drawing && currentStroke.length > 0) {
      setDrawnArray((prev) => {
        const newArray = [...prev, currentStroke];
        setUndoStack([]);
        setRedoStack([]);
        return newArray;
      });
      setCurrentStroke([]);
    }
    setDrawing(false);
  };

  const undo = () => {
    setDrawnArray((prev) => {
      if (prev.length === 0) return prev;
      const newDrawn = prev.slice(0, -1);
      setRedoStack((r) => [prev[prev.length - 1], ...r]);
      return newDrawn;
    });
  };

  const redo = () => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      setDrawnArray((d) => [...d, first]);
      return rest;
    });
  };

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

  const restore = (strokes) => {
    const ctx = ctxRef.current;
    ctx.fillStyle = bucketColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    strokes.forEach((stroke) => {
      if (stroke.length > 0) {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        ctx.lineWidth = stroke[0].size;
        ctx.strokeStyle = stroke[0].eraser ? bucketColor : stroke[0].color;
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      }
    });
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
