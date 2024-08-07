import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check, X } from 'lucide-react-native';

const QuestionHandler = ({ question, answers, correctAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-white text-xl font-bold mb-4">{question}</Text>
      {answers.map((answer, index) => (
        <Pressable
          key={index}
          className={`w-full py-3 px-4 rounded-full mb-2 ${
            selectedAnswer === index
              ? isCorrect
                ? 'bg-green-500'
                : 'bg-red-500'
              : 'bg-gray-700'
          }`}
          onPress={() => handleAnswerSelect(index)}
          disabled={showResult}
        >
          <Text className="text-white">{answer}</Text>
        </Pressable>
      ))}
      {showResult && (
        <View className="mt-4 items-center">
          {isCorrect ? (
            <Check color="green" size={24} />
          ) : (
            <X color="red" size={24} />
          )}
          <Text className="text-white mt-2">
            {isCorrect ? "Correct!" : "Incorrect. Try again!"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default QuestionHandler;
