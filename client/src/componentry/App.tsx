import React from "react";
import { Tester } from "./Tester";

export const App: React.FC<{urls: string[]}> = ({ urls }) => {
  return (
    <div>
      {urls.map((url) => (
        <Tester key={url} url={url} />
      ))}
    </div>
  );
};

App.displayName = "App";
