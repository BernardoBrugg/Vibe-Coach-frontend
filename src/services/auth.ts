import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "@vibe_coach:user_id";

export const saveUserId = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  } catch (error) {
    console.error("Error saving user ID:", error);
    throw error;
  }
};

export const getUserId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

export const clearUserId = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error("Error clearing user ID:", error);
    throw error;
  }
};
