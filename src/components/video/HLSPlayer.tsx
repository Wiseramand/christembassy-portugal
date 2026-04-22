"use client";

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  url: string;
  isLive: boolean;
  autoPlay?: boolean;
}

export default function HLSPlayer({ url, isLive, autoPlay = true }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch((e) => console.log("Autoplay blocked:", e));
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Network error encountered. Please check your connection.");
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError("Media error encountered. Attempting to recover...");
              hls?.recoverMediaError();
              break;
            default:
              setError("Failed to load stream. Please try again later.");
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        if (autoPlay) {
          video.play().catch((e) => console.log("Autoplay blocked:", e));
        }
      });
    } else {
      setError("Your browser does not support HLS playback.");
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url, autoPlay]);

  if (!isLive) {
    return (
      <div className="aspect-video w-full bg-navy flex flex-col items-center justify-center text-white rounded-2xl border border-white/10 p-6 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
           <div className="w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-white/20 rounded-full" />
           </div>
        </div>
        <h3 className="text-2xl font-poppins font-bold mb-2 text-white">Stream is currently offline</h3>
        <p className="text-gray-400 max-w-sm">
          Visit our schedule to see when the next live session starts. 
          In the meantime, you can watch our previous teachings.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group">
      {error && (
        <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center p-6 text-center">
          <p className="text-white font-medium">{error}</p>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        poster="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=2000"
      />

      <div className="absolute top-4 left-4 z-10">
        <div className="bg-wine text-white px-3 py-1 rounded flex items-center gap-2 text-xs font-bold uppercase tracking-wider animate-fade-in-up">
           <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          LIVE NOW
        </div>
      </div>
    </div>
  );
}
