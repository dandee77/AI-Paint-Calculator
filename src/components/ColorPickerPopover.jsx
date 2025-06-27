import React, { useState, useRef, useEffect } from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

// got from https://casesandberg.github.io/react-color/

export default function ColorPickerPopover({ color, onChange }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const popoverRef = useRef(null);
  const swatchRef = useRef(null);

  useEffect(() => {
    if (!displayColorPicker) return;
    function handleClick(e) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        swatchRef.current &&
        !swatchRef.current.contains(e.target)
      ) {
        setDisplayColorPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [displayColorPicker]);

  const styles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        background:
          typeof color === "string"
            ? color
            : `rgba(${color.r || 0}, ${color.g || 0}, ${color.b || 0}, ${
                color.a !== undefined ? color.a : 1
              })`,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: 1000,
        top: "40px",
        left: 0,
      },
    },
  });

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        ref={swatchRef}
        style={styles.swatch}
        onClick={() => setDisplayColorPicker((v) => !v)}
      >
        <div style={styles.color} />
      </div>
      {displayColorPicker ? (
        <div ref={popoverRef} style={styles.popover}>
          <div style={{ color: "black" }}>
            <SketchPicker
              color={color}
              onChange={(c) => {
                if (onChange) onChange(c.hex);
              }}
              disableAlpha={false}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
