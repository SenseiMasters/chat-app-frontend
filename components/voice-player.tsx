"use client";

import * as React from "react";

import { StandardButton } from "./button";
import { SocketIoContext } from "@/providers/socket-io.provider";

export const VoicePlayer: React.FC = () => {
  const { socket } = React.useContext(SocketIoContext);
  const [isListening, setIsIslistening] = React.useState<boolean>(false);
  const listen = React.useRef<boolean>(false);

  const toggleListening = () => {
    setIsIslistening(!isListening);
  };
  React.useEffect(() => {
    listen.current = isListening;
  }, [isListening]);

  React.useEffect(() => {
    if (!socket) return;

    socket.on("audioStream", (arrayBuffer: string) => {
      if (!listen.current) return;
      const blob = new Blob([arrayBuffer], { type: "audio/wav" });
      const url = window.URL.createObjectURL(blob);
      const audio = new Audio(url);
      if (!audio || document.hidden) return;
      audio.play();
    });
    socket.on("audioStreamGap", (arrayBuffer: string) => {
      if (!listen.current) return;
      const blob = new Blob([arrayBuffer], { type: "audio/wav" });
      const url = window.URL.createObjectURL(blob);
      const audio = new Audio(url);
      if (!audio || document.hidden) return;
      audio.play();
    });
  }, [socket]);

  return (
    <div className="space-y-2">
      <p className="text-3xl font-semibold">Real-Time Voice Listener</p>
      <StandardButton onClick={toggleListening}>
        {isListening ? "Stop" : "Start"} Listening
      </StandardButton>
    </div>
  );
};
