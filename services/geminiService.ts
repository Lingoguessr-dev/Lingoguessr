const WORKER_URL = "https://lingoguessr-gemini-proxy.umarkhan-10-2009.workers.dev/";

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioCtx;
}

async function post(action: string, payload: any) {
  const r = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  return r.json();
}

export async function generateGameContent(language: string, country: string) {
  const { text } = await post("generateGameContent", { language, country });
  return JSON.parse(text || "{}");
}

export async function fetchTTSData(text: string, voiceName: string): Promise<string | null> {
  try {
    const { audio } = await post("tts", { text, voiceName });
    return audio || null;
  } catch (e) {
    console.error("TTS Fetch Error:", e);
    return null;
  }
}

export async function getClue(question: string, language: string, country: string): Promise<string> {
  const { text } = await post("getClue", { question, language, country });
  return text || "I'm not sure.";
}

export async function generateCulturalHint(language: string, country: string): Promise<string> {
  const { text } = await post("generateCulturalHint", { language, country });
  return text || "A place of rich heritage.";
}

export async function playTTSFromData(base64Data: string): Promise<AudioBufferSourceNode | null> {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") await ctx.resume();

    const audioData = decode(base64Data);
    const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    return source;
  } catch (error) {
    console.error("TTS Play Error:", error);
    return null;
  }
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
