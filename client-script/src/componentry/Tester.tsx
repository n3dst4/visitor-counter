import React, { useCallback } from "react";
import { registerHit } from "../registerHit";

export const Tester: React.FC<{
  url: string,
}> = ({
  url,
}) => {
  const handleHit = useCallback((moduleName?: string) => {
    registerHit({ counterServiceUrl: url, moduleName });
  }, [url]);
  return (
    <div>
      <h1>Tester: <code>{url}</code></h1>
      <button onClick={() => { handleHit(); }}>Register system hit</button>
      <button onClick={() => { handleHit("my-module"); }}>Register module hit</button>
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
