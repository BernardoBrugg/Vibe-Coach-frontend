import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Alert,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { sendChatMessage, getUser, getTransactions } from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import Markdown from "react-native-markdown-display";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const headerHeight = useHeaderHeight();
  const { userId, isLoading: authLoading } = useAuth();
  

  const { data: userProfile } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => getTransactions(userId!),
    enabled: !!userId,
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Olá! Sou o Vibe Coach. Vamos analisar suas finanças. O que você precisa?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [aiMessage, ...prev]);
    },
    onError: (error: any) => {
      console.error("Chat error:", error);
      let errorText = "Desculpe, houve um erro ao processar sua mensagem.";

      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        errorText = "❌ Erro de conexão com a API.";
      } else if (error.response) {
        errorText = `Erro ${error.response.status}: ${error.response.data?.message || "Erro no servidor"}`;
      }

      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [errorMessage, ...prev]);
    },
  });

  const handleSend = () => {
    if (!inputText.trim() || !userId) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInputText("");

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);


    let systemContext = `
    INSTRUÇÕES DO SISTEMA:
    Você é o Vibe Coach, um assistente financeiro ASSERTIVO, OBJETIVO e REGULADOR.
    Responda em PORTUGUÊS.
    
    PERFIL DO USUÁRIO:
    - Nome: ${userProfile?.name || "Desconhecido"}
    - Saldo Atual: R$ ${userProfile?.currentBalance || "0.00"}
    - Renda Mensal: R$ ${userProfile?.monthlyIncome || "Não informado"}
    - Despesas Fixas: R$ ${userProfile?.fixedExpenses || "Não informado"}
    
    ÚLTIMAS TRANSAÇÕES:
    ${transactions
      ?.slice(0, 5)
      .map(
        (t) =>
          `- ${t.date.split("T")[0]}: ${t.title} (${t.type}) - R$ ${t.amount} (${t.category})`
      )
      .join("\n") || "Nenhuma transação recente."}
    
    SUA TAREFA:
    Responda à mensagem do usuário abaixo levando em conta estritamente os dados acima.
    Se o usuário perguntar se pode comprar algo, verifique o saldo e as despesas.
    Seja direto. Não use frases genéricas como "Consulte um especialista". VOCÊ É O ESPECIALISTA.
    
    MENSAGEM DO USUÁRIO:
    ${userMessage.text}
    `;

    chatMutation.mutate({
      userId,
      message: systemContext,
    });
  };

  if (authLoading) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-zinc-400 mt-4">Carregando...</Text>
      </View>
    );
  }

  if (!userId) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center p-6">
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text className="text-red-500 text-center mt-4 text-lg">
          Nenhum usuário logado
        </Text>
        <Text className="text-zinc-400 text-center mt-2">
          Por favor, faça login primeiro
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-zinc-900"
      keyboardVerticalOffset={headerHeight}
    >
      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{
            flexDirection: "column-reverse",
            paddingBottom: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-3 ${message.isUser ? "items-end" : "items-start"}`}
            >
              <View
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  message.isUser ? "bg-violet-600" : "bg-zinc-800"
                }`}
              >
                <Markdown
                  style={{
                    body: {
                      color: message.isUser ? "#ffffff" : "#f4f4f5",
                      fontSize: 16,
                    },
                    heading1: {
                      color: message.isUser ? "#ffffff" : "#f4f4f5",
                      fontSize: 24,
                      fontWeight: "bold",
                      marginBottom: 10,
                    },
                    heading2: {
                      color: message.isUser ? "#ffffff" : "#f4f4f5",
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 8,
                    },
                    strong: {
                      color: message.isUser ? "#ffffff" : "#f4f4f5",
                      fontWeight: "bold",
                    },
                    paragraph: {
                      marginBottom: 10,
                    },
                  }}
                >
                  {message.text}
                </Markdown>
              </View>
              <Text className="text-zinc-500 text-xs mt-1 px-2">
                {message.timestamp.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))}
          {chatMutation.isPending && (
            <View className="mb-3 items-start">
              <View className="bg-zinc-800 rounded-2xl px-4 py-3">
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#8b5cf6" />
                  <Text className="text-zinc-400 ml-2">
                    Vibe Coach está digitando...
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View className="border-t border-zinc-800 bg-zinc-900 px-4 py-3">
          <View className="flex-row items-center bg-zinc-800 rounded-full px-4 py-2">
            <TextInput
              className="flex-1 text-zinc-100 text-base py-2 max-h-24"
              placeholder="Pergunte ao Vibe Coach..."
              placeholderTextColor="#71717a"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              multiline
              maxLength={500}
              editable={!chatMutation.isPending}
              blurOnSubmit={false}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || chatMutation.isPending}
              className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
                inputText.trim() && !chatMutation.isPending
                  ? "bg-violet-600"
                  : "bg-zinc-700"
              }`}
            >
              <Ionicons
                name="send"
                size={20}
                color={
                  inputText.trim() && !chatMutation.isPending
                    ? "#ffffff"
                    : "#52525b"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
