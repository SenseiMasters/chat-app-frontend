"use client";

import * as React from "react";

import { StandardButton } from "./button";
import { SocketIoContext } from "@/providers/socket-io.provider";
import { RecorderContext } from "@/providers/recorder-provider";

export const VoiceRecorder: React.FC = () => {
  const { socket } = React.useContext(SocketIoContext);
  const settings = React.useContext(RecorderContext);

  const [isRecording, setIsRecording] = React.useState<boolean>(false);

  const record = React.useRef<boolean>(false);
  const audioBlob = React.useRef<BlobPart[]>([]);
  const gapAudioBlob = React.useRef<BlobPart[]>([]);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const gapMediaRecorderRef = React.useRef<MediaRecorder | null>(null);

  const sendVoiceToServer = (blob: Blob) => {
    if (!socket) return;
    socket.emit("audioStream", blob);
    audioBlob.current = [];
  };

  const resetMediaRecorder = () => {
    mediaRecorderRef.current?.start();
    console.log("* start");
    
    setTimeout(() => {
      mediaRecorderRef.current?.stop();
      console.log("* end");
    }, settings.quantizationTime);
    setTimeout(() => {
      gapMediaRecorderRef.current?.start();
      console.log("- start");
    }, settings.quantizationTime - 500);
    setTimeout(() => {
      gapMediaRecorderRef.current?.stop();
      console.log("- end");
    }, settings.quantizationTime + 500);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: settings.echoCancellation,
          noiseSuppression: settings.noiseSuppression,
          frameRate: { ideal: 15, max: 15 },
        },
        video: false,
      });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        audioBitsPerSecond: 10000,
        mimeType: "audio/webm;codecs=opus",
      });
      gapMediaRecorderRef.current = new MediaRecorder(stream, {
        audioBitsPerSecond: 10000,
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (!record.current) return;
        if (event.data.size <= 0 || !socket) return;
        audioBlob.current.push(event.data);
      };
      gapMediaRecorderRef.current.ondataavailable = async (event) => {
        if (!record.current) return;
        if (event.data.size <= 0 || !socket) return;
        gapAudioBlob.current.push(event.data);
      };

      mediaRecorderRef.current.addEventListener("stop", async () => {
        if (!record.current) return;
        if (!socket || !mediaRecorderRef.current) return;
        socket.emit("audioStream", new Blob(audioBlob.current));
        audioBlob.current = [];
        resetMediaRecorder();
      });
      gapMediaRecorderRef.current.addEventListener("stop", async () => {
        if (!record.current) return;
        if (!socket || !gapMediaRecorderRef.current) return;
        socket.emit("audioStreamGap", new Blob(gapAudioBlob.current));
        gapAudioBlob.current = [];
      });

      resetMediaRecorder();
      setIsRecording(true);
      record.current = true;
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
    record.current = false;

    if (!audioBlob.current?.length) return;
    sendVoiceToServer(new Blob(audioBlob.current));
  };

  return (
    <div className="space-y-2">
      <p className="text-3xl font-semibold">Real-Time Voice Recorder</p>
      {isRecording ? (
        <StandardButton onClick={stopRecording}>Stop Recording</StandardButton>
      ) : (
        <StandardButton onClick={startRecording}>
          Start Recording
        </StandardButton>
      )}
    </div>
  );
};
