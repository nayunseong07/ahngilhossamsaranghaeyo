
import { useCallback } from 'react';

// 성능 최적화를 위해 단일 AudioContext를 재사용합니다.
let audioContext: AudioContext | null = null;
const getAudioContext = () => {
  if (typeof window !== 'undefined') {
    if (!audioContext || audioContext.state === 'closed') {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }
  return audioContext;
};

export const useAudio = () => {
  const playSound = useCallback((type: 'correct' | 'incorrect' | 'know' | 'learn' | 'completion') => {
    try {
      const context = getAudioContext();
      if (!context) return;

      const now = context.currentTime;

      if (type === 'completion') {
         // Victory arpeggio (C Major: C5, E5, G5, C6) - Peak-End Rule: Ending with a high positive peak
         const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
         const startTimes = [0, 0.1, 0.2, 0.3];
         
         notes.forEach((freq, i) => {
            const osc = context.createOscillator();
            const gn = context.createGain();
            osc.connect(gn);
            gn.connect(context.destination);
            
            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            const t = now + startTimes[i];
            gn.gain.setValueAtTime(0, t);
            gn.gain.linearRampToValueAtTime(0.1, t + 0.05);
            gn.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            
            osc.start(t);
            osc.stop(t + 0.4);
         });
         return;
      }

      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      switch (type) {
        case 'correct':
          // Success chime
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(600, now);
          oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.1);
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          oscillator.start(now);
          oscillator.stop(now + 0.3);
          break;

        case 'incorrect':
          // Error buzz
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(200, now);
          oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.15);
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          oscillator.start(now);
          oscillator.stop(now + 0.3);
          break;

        case 'know':
          // Ascending pleasant tone (Swipe Right / Success)
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(440, now); // A4
          oscillator.frequency.exponentialRampToValueAtTime(659, now + 0.1); // E5 (Major interval)
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          oscillator.start(now);
          oscillator.stop(now + 0.2);
          break;

        case 'learn':
          // Neutral/Descending tone (Swipe Left / Review later)
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, now); // A4
          oscillator.frequency.linearRampToValueAtTime(330, now + 0.15); // E4 (Descending)
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          oscillator.start(now);
          oscillator.stop(now + 0.2);
          break;
      }

    } catch (error) {
      console.error("Failed to play sound", error);
    }
  }, []);

  const playCorrectSound = useCallback(() => playSound('correct'), [playSound]);
  const playIncorrectSound = useCallback(() => playSound('incorrect'), [playSound]);
  const playKnowSound = useCallback(() => playSound('know'), [playSound]);
  const playLearnSound = useCallback(() => playSound('learn'), [playSound]);
  const playCompletionSound = useCallback(() => playSound('completion'), [playSound]);

  return { playCorrectSound, playIncorrectSound, playKnowSound, playLearnSound, playCompletionSound };
};
