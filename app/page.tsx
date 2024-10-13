import { VoicePlayer } from "./components/voice-player";
import { VoiceRecorder } from "./components/voice-recoreder";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <section className="space-y-6">
        <VoiceRecorder />
        <VoicePlayer />
      </section>
    </main>
  );
}
