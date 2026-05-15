import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Volume2, Maximize } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  if (!secureUrl) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] text-center">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Video solution coming soon</p>
      </div>
    );
  }

  return (
    <div 
      className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-cyan-950/20"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video cursor-pointer"
      />
      
      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
        isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Play Button Center */}
        {!isPlaying && (
          <button onClick={togglePlayPause} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-xl transition hover:scale-110">
            <Play size={32} fill="currentColor" />
          </button>
        )}

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="mb-3 flex items-center gap-3">
             <button onClick={togglePlayPause} className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20">
               {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
             </button>
             <span className="text-xs font-bold text-white tabular-nums">
               {formatTime(currentTime)} / {formatTime(duration)}
             </span>
             <div className="ml-auto flex items-center gap-2">
                <Volume2 size={18} className="text-white/70" />
                <Maximize size={18} className="text-white/70" />
             </div>
          </div>

          {/* Progress Slider */}
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div 
              className="absolute h-full bg-cyan-400 transition-all duration-100" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                if (videoRef.current) videoRef.current.currentTime = Number(e.target.value);
              }}
              className="absolute inset-0 z-10 w-full cursor-pointer opacity-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;