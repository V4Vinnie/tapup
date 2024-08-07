import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Video, Audio } from 'expo-av';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const VideoStoryView = ({ story, setNextButtonDisabled }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setNextButtonDisabled(false);
    async function setupAudio() {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    }

    setupAudio();

    if (videoRef.current) {
      videoRef.current.playAsync();
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  if (!story || !story.video) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Error: Video not available</Text>
      </View>
    );
  }

  const togglePlay = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const toggleMute = async () => {
    if (videoRef.current) {
      setIsMuted(!isMuted);
      await videoRef.current.setIsMutedAsync(!isMuted);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 justify-center items-center">
        {!status.isLoaded && (
          <View className="absolute inset-0 flex items-center justify-center bg-opacity-50 z-10">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
        <Video
          ref={videoRef}
          source={{ uri: story.video }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          isLooping
          isMuted={isMuted}
          onPlaybackStatusUpdate={setStatus}
          useNativeControls={false}
        />
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        className="absolute bottom-0 left-0 right-0"
      >
        <View className="px-4 pb-4 pt-8">
          <View className="bg-gray-800 bg-opacity-75 rounded-full h-1 mb-2">
            <View
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${(status.positionMillis / status.durationMillis) * 100 || 0}%` }}
            />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-sm flex-1 mr-4">{story.caption}</Text>
            <View className="flex-row">
              <Pressable
                onPress={toggleMute}
                className="bg-gray-800 bg-opacity-75 rounded-full p-2 mr-2"
              >
                {isMuted ? (
                  <VolumeX size={20} color="white" />
                ) : (
                  <Volume2 size={20} color="white" />
                )}
              </Pressable>
              <Pressable
                onPress={togglePlay}
                className="bg-gray-800 bg-opacity-75 rounded-full p-2"
              >
                {status.isPlaying ? (
                  <Pause size={20} color="white" />
                ) : (
                  <Play size={20} color="white" />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default VideoStoryView;