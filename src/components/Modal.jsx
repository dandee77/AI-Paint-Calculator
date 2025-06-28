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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-700 rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative animate-zoomIn border-2 border-gray-500"
        style={{ animation: "zoomIn 0.25s cubic-bezier(.4,2,.6,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-200 transition font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-mono font-bold text-gray-100 mb-6 text-center uppercase">
          Results
        </h2>
        {Array.isArray(result) ? (
          <ul className="space-y-4">
            {result.map((item, i) => (
              <li
                key={i}
                className="bg-white rounded-xl p-5 shadow flex flex-col gap-2 border-l-4 border-gray-500"
              >
                <div className="font-mono text-lg text-gray-900 font-bold">
                  <span className="text-gray-900 font-mono font-bold">
                    Expression:
                  </span>{" "}
                  {item.expr}
                </div>
                <div className="font-mono text-lg text-gray-900 font-bold">
                  <span className="text-gray-900 font-mono font-bold">
                    Result:
                  </span>{" "}
                  {item.result}
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
          <div className="text-gray-100 text-lg text-center py-8 font-mono font-bold">
            {String(result)}
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <button
            className="px-8 py-2 rounded bg-gray-900 text-white font-mono font-bold text-lg shadow hover:bg-gray-800 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
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
