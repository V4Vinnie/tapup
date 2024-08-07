import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Video, Audio } from 'expo-av';
import { Video as VideoIcon, StopCircle, Check, X, Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const VideoRecordingScreen = ({ navigation }) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = Audio.usePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    requestCameraPermission();
    requestAudioPermission();
    
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  }, []);

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({
        maxDuration: 60, // Limit to 60 seconds
        mute: false, // Ensure audio is recorded
      });
      setVideoUri(video.uri);
      setIsPlaying(true);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const saveVideo = () => {
    navigation.navigate('StoryView', { newVideoUri: videoUri });
  };

  const discardVideo = () => {
    setVideoUri(null);
    setIsPlaying(false);
    setIsMuted(false);
  };

  if (!cameraPermission || !audioPermission) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-white">Requesting permissions...</Text>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted || !audioPermission.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-white mb-4">We need your permission to use the camera and microphone</Text>
        <TouchableOpacity className="bg-blue-500 rounded-full px-6 py-3" onPress={() => {
          requestCameraPermission();
          requestAudioPermission();
        }}>
          <Text className="text-white text-base">Grant Permissions</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 px-4 pt-4 pb-8">
        <View className="flex-1 mt-4 bg-gray-800 rounded-3xl overflow-hidden">
          {videoUri ? (
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              className="flex-1 w-full"
              resizeMode="cover"
              isLooping
              isMuted={isMuted}
              onPlaybackStatusUpdate={(status) => setIsPlaying(status.isPlaying)}
            />
          ) : (
            <CameraView
              ref={cameraRef}
              className="flex-1 w-full"
              facing='back'
              enableTorch={false}
              mode="video"
            />
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            className="absolute top-0 left-0 right-0 h-20 z-10"
          />
          <View className="absolute top-0 left-0 right-0 p-4 flex-row justify-between items-center z-20">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <X color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">
              {videoUri ? 'Preview Video' : 'Record Video'}
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </View>
        
        <View className="mt-4 flex-row justify-center items-center">
          {!videoUri ? (
            <TouchableOpacity
              className="bg-red-500 p-4 rounded-full"
              onPress={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <StopCircle color="white" size={32} />
              ) : (
                <VideoIcon color="white" size={32} />
              )}
            </TouchableOpacity>
          ) : (
            <View className="flex-row justify-center items-center space-x-8">
              <TouchableOpacity className="bg-red-500 p-3 rounded-full" onPress={discardVideo}>
                <X color="white" size={24} />
              </TouchableOpacity>
              <TouchableOpacity className="bg-blue-500 p-3 rounded-full" onPress={togglePlayPause}>
                {isPlaying ? (
                  <Pause color="white" size={24} />
                ) : (
                  <Play color="white" size={24} />
                )}
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-500 p-3 rounded-full" onPress={toggleMute}>
                {isMuted ? (
                  <VolumeX color="white" size={24} />
                ) : (
                  <Volume2 color="white" size={24} />
                )}
              </TouchableOpacity>
              <TouchableOpacity className="bg-green-500 p-3 rounded-full" onPress={saveVideo}>
                <Check color="white" size={24} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VideoRecordingScreen;