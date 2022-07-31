import React, { useCallback } from "react";
import { registerVisit } from "../registerVisit";

export const Tester: React.FC<{
  url: string,
}> = ({
  url,
}) => {
  const handleVisit = useCallback((moduleName?: string) => {
    registerVisit({ counterServiceUrl: url, moduleName });
  }, [url]);
  return (
    <div>
      <h1>Tester: <code>{url}</code></h1>
      <button onClick={() => { handleVisit(); }}>Register system visit</button>
      <button onClick={() => { handleVisit("my-module"); }}>Register module visit</button>
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
