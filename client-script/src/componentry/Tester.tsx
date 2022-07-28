import React, { useCallback } from "react";
import { registerClientVisit } from "../client-script";

export const Tester: React.FC<{
  url: string,
}> = ({
  url,
}) => {
  const handleHit = useCallback((moduleName?: string) => {
    registerClientVisit({ url, moduleName });
  }, [url]);
  return (
    <div>
      <h1>Tester: <code>{url}</code></h1>
      <button onClick={() => { handleHit(); }}>Register system hit</button>
      <button onClick={() => { handleHit("my-module"); }}>Register module hit</button>
    </div>
  );
};

Tester.displayName = "Tester";
