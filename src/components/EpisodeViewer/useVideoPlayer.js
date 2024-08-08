import { useState, useRef, useEffect } from 'react';

const useVideoPlayer = (videoUri) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    loadVideo();
  }, [videoUri]);

  const loadVideo = async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.loadAsync(
          { uri: videoUri },
          { shouldPlay: true, isMuted: false },
          false
        );
      }
    } catch (err) {
      console.error('Error loading video:', err);
      setError(err);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && !isLoaded) {
      setIsLoaded(true);
    }
    if (status.isPlaying !== isPlaying) {
      setIsPlaying(status.isPlaying);
    }
    if (status.isLoaded) {
      setProgress((status.positionMillis / status.durationMillis) * 100);
    }
  };

  const togglePlay = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  return {
    videoRef,
    isPlaying,
    isLoaded,
    progress,
    error,
    togglePlay,
    onPlaybackStatusUpdate
  };
};

export default useVideoPlayer;