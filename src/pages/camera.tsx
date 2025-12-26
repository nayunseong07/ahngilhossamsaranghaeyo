
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
}

const App: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/png');
      const newPhoto: Photo = {
        id: Date.now().toString(),
        dataUrl,
        timestamp: Date.now(),
      };

      setPhotos(prev => [newPhoto, ...prev]);
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col items-center p-0 font-mono">
      {/* 고정된 뷰파인더 */}
      <div className="w-full bg-zinc-900 overflow-hidden aspect-square">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* 단순 셔터 바 */}
      <div className="w-full flex-1 flex flex-col justify-between p-4">
        <button
          onClick={takePhoto}
          className="w-full py-6 border-2 border-white text-white font-bold"
        >
          CAPTURE
        </button>

        {/* 단순 이미지 리스트 */}
        <div className="flex gap-2 overflow-x-auto py-4">
          {photos.map(photo => (
            <img
              key={photo.id}
              src={photo.dataUrl}
              alt=""
              className="w-20 h-20 object-cover border border-zinc-700"
            />
          ))}
        </div>
        
        <div className="text-[10px] text-zinc-500 text-center">
          MINIMAL MODE : NO FX
        </div>
      </div>
    </div>
  );
};

export default App;
