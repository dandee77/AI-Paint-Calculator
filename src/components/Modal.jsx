import { useEffect } from "react";

export default function Modal({ open, onClose, result }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full relative animate-zoomIn"
        style={{ animation: "zoomIn 0.25s cubic-bezier(.4,2,.6,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">AI Result</h2>
        {Array.isArray(result) ? (
          <ul className="space-y-2">
            {result.map((item, i) => (
              <li key={i} className="bg-gray-100 rounded p-3">
                <div className="font-mono text-sm text-gray-700">
                  <span className="font-semibold">Expression:</span> {item.expr}
                </div>
                <div className="font-mono text-sm text-gray-700">
                  <span className="font-semibold">Result:</span> {item.result}
                </div>
                {item.assign && (
                  <div className="font-mono text-xs text-green-700 mt-1">
                    Assignment
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-700">{String(result)}</div>
        )}
      </div>
      <style>{`
        @keyframes zoomIn {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-zoomIn { animation: zoomIn 0.25s cubic-bezier(.4,2,.6,1); }
      `}</style>
    </div>
  );
}
