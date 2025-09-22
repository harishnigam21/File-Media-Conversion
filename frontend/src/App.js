import { useEffect, useState } from "react";
import Header from "./Repeated_Component/Header";
import Home from "./Home";
import { useParams } from "react-router-dom";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
function App() {
  const [resolution, setResolution] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const params = useParams();
  const [fingerprint, setFingerprint] = useState(null);
  const [tempUser, setTempUser] = useState(() => {
    const saved = window.localStorage.getItem("tempUser");
    return saved ? JSON.parse(saved) : { used: 0, max: 3, maxSize: 5 };
  });
  const [limitExceeded, setLimitExceeded] = useState(() => {
    const saved = window.localStorage.getItem("tempUser");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.used === parsed.max;
    }
    return false;
  });
  const tempUses = () => {
    if (tempUser.used < tempUser.max) {
      setTempUser((props) => ({ ...props, used: props.used + 1 }));
    }
  };
  useEffect(() => {
    if (tempUser.used === tempUser.max) {
      setLimitExceeded(true);
    }
    window.localStorage.setItem("tempUser", JSON.stringify(tempUser));
  }, [tempUser]);
  useEffect(() => {
    FingerprintJS.load().then((fp) => {
      fp.get().then((result) => {
        setFingerprint(result.visitorId);
      });
    });
    //TODO : solve this problem later
    // if (params.email) {
    //   if (params.email !== emailCookie) {
    //     alert("Your session has been expired, please SignIn again.");
    //     navigate("/signin");
    //   }
    //   return;
    // }
  }, []);
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
      <Home
        tempUses={tempUses}
        limitExceeded={limitExceeded}
        params={params}
        tempUser={tempUser}
        fingerprint={fingerprint}
        setLimitExceeded={setLimitExceeded}
        setTempUser={setTempUser}
      />
    </>
  );
}
export default App;
