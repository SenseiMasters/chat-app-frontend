import { VoicePlayer } from "@/components/voice-player";
import { VoiceSettings } from "@/components/voice-settings";
import { VoiceRecorder } from "@/components/voice-recoreder";
import { RecorderProvider } from "../providers/recorder-provider";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <section className="space-y-6">
        <RecorderProvider>
          <VoiceRecorder />
          <VoicePlayer />
          <VoiceSettings />
        </RecorderProvider>
      </section>
    </main>
  );
}
