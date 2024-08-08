import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProgressBar = ({ currentIndex, totalStories }) => {
  return (
    <View className="flex-row space-x-1 mb-2 mt-2">
      {[...Array(totalStories)].map((_, index) => (
        <View 
          key={index} 
          className="h-1 flex-grow rounded-full overflow-hidden bg-gray-700"
        >
          {index <= currentIndex && (
            <LinearGradient
              colors={['#3B82F6', '#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-full h-full"
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default ProgressBar;