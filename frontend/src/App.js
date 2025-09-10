import { useEffect, useState } from "react";
import Header from "./Repeated_Component/Header";
import Home from "./Home";
function App() {
  const [resolution, setResolution] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(() => {
    const handleResize = () => {
      setResolution({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <Header size={resolution} />
      <Home />
    </>
  );
}
export default App;
