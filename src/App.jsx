import { useState } from "react";
import Marker from "./toolbar/Marker";

function App() {
  const [tool, setTool] = useState("brush");

  return (
    <>
      <Marker tool={tool} onToolChange={setTool} />
    </>
  );
}

export default App;
