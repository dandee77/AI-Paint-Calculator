import React, { useState } from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

// got from https://casesandberg.github.io/react-color/

export default function ColorPickerPopover({ color, onChange }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

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
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  return (
    <div>
      <div
        style={styles.swatch}
        onClick={() => setDisplayColorPicker((v) => !v)}
      >
        <div style={styles.color} />
      </div>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div
            style={styles.cover}
            onClick={() => setDisplayColorPicker(false)}
          />
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
