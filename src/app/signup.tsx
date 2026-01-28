import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { registerUser, googleLogin } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

export default function SignupScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Not used by backend yet, but good for UI
  const [confirmPassword, setConfirmPassword] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: "vibe-coach-app",
      path: "oauth2redirect"
    }),
  });

  const googleLoginMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: async (data: any) => {
      if (data.isNewUser) {
        // Redirect to complete profile if it's a new user from Google
        // This might be redundant if the google auth response already returns a User, 
        // but safe to follow established flow.
         router.push({
          pathname: "/complete-profile",
          params: { email: data.email, name: data.name },
        });
      } else if (data.token && data.user) {
        await signIn(data.token, data.user);
        router.replace("/(tabs)");
      }
    },
    onError: (err) => {
      console.error("Google Auth Error:", err);
      Alert.alert("Erro", "Falha ao autenticar com Google.");
    },
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        googleLoginMutation.mutate(authentication.accessToken);
      }
    }
  }, [response]);

  const handleNext = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
        Alert.alert("Erro", "As senhas não coincidem.");
        return;
    }
    
    // Check if password length is decent (UI only check)
    if (password.length < 6) {
        Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    // Since we don't have a direct "Signup with Password" endpoint that handles the password properly yet,
    // We will proceed to the Complete Profile screen passing the basic info.
    // The password will technically be ignored by the current `registerUser` function in complete-profile unless we update it,
    // but for the "User Experience" requested, this is the flow.
    
    router.push({
        pathname: "/complete-profile",
        params: { email, name }, // Password dropped for now as backend doesn't take it in registerUser
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-zinc-900"
    >
      <ScrollView className="flex-1 px-6">
        <View className="flex-row items-center mt-6 mb-8">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
                <Ionicons name="arrow-back" size={24} color="#a1a1aa" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Criar Conta</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-zinc-400 mb-2">Nome Completo</Text>
            <TextInput
              className="bg-zinc-800 text-white p-4 rounded-xl"
              placeholder="Seu nome"
              placeholderTextColor="#71717a"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-zinc-400 mb-2">E-mail</Text>
            <TextInput
              className="bg-zinc-800 text-white p-4 rounded-xl"
              placeholder="seu@email.com"
              placeholderTextColor="#71717a"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-zinc-400 mb-2">Senha</Text>
            <TextInput
              className="bg-zinc-800 text-white p-4 rounded-xl"
              placeholder="******"
              placeholderTextColor="#71717a"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

           <View>
            <Text className="text-zinc-400 mb-2">Confirmar Senha</Text>
            <TextInput
              className="bg-zinc-800 text-white p-4 rounded-xl"
              placeholder="******"
              placeholderTextColor="#71717a"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            className="bg-violet-600 p-4 rounded-xl items-center mt-4"
            onPress={handleNext}
          >
            <Text className="text-white font-bold text-lg">Continuar</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-zinc-800" />
            <Text className="text-zinc-500 mx-4">OU</Text>
            <View className="flex-1 h-px bg-zinc-800" />
        </View>

        <TouchableOpacity
            className="flex-row items-center justify-center bg-white p-4 rounded-xl mb-8"
            onPress={() => promptAsync()}
        >
            <Ionicons name="logo-google" size={24} color="#000" />
            <Text className="text-black font-bold text-lg ml-3">
                Cadastrar com Google
            </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
