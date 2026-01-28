
import { GoogleGenAI, Modality, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioCtx;
}

export async function generateGameContent(language: string, country: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a short, interesting sentence in English and translate it into ${language} as spoken in ${country}. Return only JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          english: { type: Type.STRING },
          native: { type: Type.STRING }
        },
        required: ["english", "native"]
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
}

export async function fetchTTSData(text: string, voiceName: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Fetch Error:", error);
    return null;
  }
}

export async function getClue(question: string, language: string, country: string): Promise<string> {
  const validator = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user is guessing the language: ${language} from ${country}. They asked: "${question}". Is this question too obvious? Answer with "OBVIOUS" or "OK".`,
  });

  if (validator.text?.includes("OBVIOUS")) return "ASK_ANOTHER";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user is guessing the language: ${language} from ${country}. Answer without giving the answer. Question: "${question}"`,
  });

  return response.text || "I'm not sure.";
}

export async function generateCulturalHint(language: string, country: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a vague cultural hint for ${language} / ${country}. No names. Short.`,
  });
  return response.text || "A place of rich heritage.";
}

export async function playTTSFromData(base64Data: string): Promise<AudioBufferSourceNode | null> {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') await ctx.resume();

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
