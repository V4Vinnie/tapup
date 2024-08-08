import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import AnswerOption from './AnswerOption';

const QuestionContent = ({
  question,
  description,
  answers,
  correctAnswer,
  selectedAnswer,
  showResult,
  onAnswerSelect,
}) => {
  return (
    <View className="flex-1 px-4 py-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2 text-white">{question}</Text>
          <Text className="text-gray-400">{description}</Text>
        </View>
        <View className="space-y-3 mb-6">
          {answers.map((answer, index) => (
            <AnswerOption
              key={index}
              answer={answer}
              index={index}
              isSelected={selectedAnswer === index}
              correctAnswer={correctAnswer}
              showResult={showResult}
              onPress={onAnswerSelect}
            />
          ))}
        </View>
      </ScrollView>
      {showResult && (
        <View className="mt-4">
          <Text className="text-white text-xl font-semibold text-center">
            {selectedAnswer === correctAnswer ? "Correct!" : "Incorrect. Try again!"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default QuestionContent;