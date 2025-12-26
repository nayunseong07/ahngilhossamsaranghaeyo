import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { VocabularyWord } from '../types';
import { SpeakerIcon, SpinnerIcon } from './Icons';

interface VocabularyCardProps {
  word: VocabularyWord;
  isReviewing: boolean;
  animationClass: string;
}

// Helper function to decode base64 string to Uint8Array
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper function to decode raw PCM audio data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
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


export const VocabularyCard: React.FC<VocabularyCardProps> = ({ word, isReviewing, animationClass }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRevealed, setIsRevealed] = useState(isReviewing);

  useEffect(() => {
    // When the word changes, reset the revealed state based on whether it's a review session.
    setIsRevealed(isReviewing);
  }, [word, isReviewing]);
  
  if (!word) return null;
  
  const handleCardClick = () => {
    if (!isReviewing) {
      setIsRevealed(true);
    }
  };

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the speaker icon
    if (isSpeaking) return;
    setIsSpeaking(true);
    
    try {
       if (!process.env.API_KEY) {
        alert("API key is not configured.");
        return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Please pronounce this word: ${word.word}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decodedBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(decodedBytes, outputAudioContext, 24000, 1);
        
        const source = outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputAudioContext.destination);
        source.start();
        
        source.onended = () => {
          outputAudioContext.close();
        };
      } else {
        throw new Error("No audio data received.");
      }

    } catch (error) {
      console.error("Error generating speech:", error);
      alert("발음을 재생하는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSpeaking(false);
    }
  };

  const isClickable = !isReviewing && !isRevealed;

  return (
    <div
      onClick={handleCardClick}
      className={`w-full h-80 flex flex-col justify-center items-center text-center p-6 bg-slate-800 rounded-2xl shadow-lg transition-colors duration-300 ${isClickable ? 'cursor-pointer hover:bg-slate-700' : ''} ${animationClass}`}
    >
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="flex items-center gap-2">
          <p className="text-4xl md:text-5xl font-bold text-slate-100">{word.word}</p>
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className="p-2 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:text-slate-500"
            aria-label={`Listen to the pronunciation of ${word.word}`}
          >
            {isSpeaking ? <SpinnerIcon /> : <SpeakerIcon />}
          </button>
        </div>
        <p className="text-lg text-slate-400 italic mt-2">{word.partOfSpeech}</p>
      </div>

      {isRevealed ? (
        <>
          <div className="w-3/4 border-b-2 border-slate-700 my-4"></div>
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-2xl md:text-3xl font-bold text-cyan-300">{word.koreanMeaning}</p>
            <p className="text-sm text-cyan-200 mt-2 text-center px-4">{word.definition}</p>
          </div>
        </>
      ) : (
         <div className="flex-1 flex flex-col justify-center items-center text-slate-400">
           <p>카드를 클릭하여 뜻 확인하기</p>
         </div>
      )}
    </div>
  );
};