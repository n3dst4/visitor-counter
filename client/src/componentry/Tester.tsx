import React, { useCallback, useEffect, useRef } from "react";
import { countVisit } from "../countVisit";
import { wait } from "../functions";

export const Tester: React.FC<{
  url: string,
}> = ({
  url,
}) => {
  const handleModuleVisit = useCallback(() => {
    return countVisit({ counterServiceUrl: url, moduleName: "my-module", country: "GB" });
  }, [url]);
  const [moduleInFlight, setModuleInFlight] = React.useState(false);

  const handleSystemVisit = useCallback(() => {
    return countVisit({ counterServiceUrl: url, country: "GB" });
  }, [url]);
  const [systemInFlight, setSystemInFlight] = React.useState(false);

  const [auto, setAuto] = React.useState(true);
  const autoRef = useRef(auto);
  autoRef.current = auto;

  const stopAuto = useCallback(() => {
    setAuto(false);
  }, []);

  const startAuto = useCallback(() => {
    setAuto(true);
    const doSystemVisit = async (force = false) => {
      if (autoRef.current || force) {
        handleSystemVisit();
        setSystemInFlight(true);
        await wait(300);
        await setTimeout(doSystemVisit, Math.random() * 10_000);
        setSystemInFlight(false);
      }
    };
    const doModuleVisit = async (force = false) => {
      if (autoRef.current || force) {
        handleModuleVisit();
        setModuleInFlight(true);
        await wait(300);
        await setTimeout(doModuleVisit, Math.random() * 5_000);
        setModuleInFlight(false);
      }
    };
    doSystemVisit(true);
    doModuleVisit(true);
    return () => {
      stopAuto();
    };
  }, [handleModuleVisit]);

  useEffect(() => {
    startAuto();
  }, [startAuto]);

  return (
    <div
      css={{
        backgroundColor: auto ? "lightgreen" : "white",
      }}
    >
      <h1>Tester: <code>{url}</code></h1>
      <button disabled={systemInFlight} onClick={handleSystemVisit}>
        Register system visit
      </button>
      <button disabled={moduleInFlight} onClick={handleModuleVisit}>
        Register module visit
      </button>
      {auto
        ? <button onClick={stopAuto}>Stop auto</button>
        : <button onClick={startAuto}>Start auto</button>
      }
      <div>
        <a
          href={ `${url.replace(/hit\/?$/, "")}/metrics` }
          target="_blank"
        >
          See metrics
        </a>
      </div>
    </div>
  );
};

Tester.displayName = "Tester";
