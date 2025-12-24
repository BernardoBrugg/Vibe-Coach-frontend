import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../services/api";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const useChat = (userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Math.random().toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((previousMessages) => [aiMessage, ...previousMessages]);
    },
  });

  const onSend = (text: string) => {
    const userMessage: Message = {
      id: Math.random().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((previousMessages) => [userMessage, ...previousMessages]);

    chatMutation.mutate({
      userId,
      message: text,
    });
  };

  return {
    messages,
    onSend,
    isLoading: chatMutation.isPending,
  };
};
