import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  useEffect(() => {
    const setNavBar = async () => {
      if (Platform.OS === "android") {
        await NavigationBar.setBackgroundColorAsync("#000000");
        await NavigationBar.setButtonStyleAsync("light");
      }
    };
    setNavBar();
  }, []);

  return (
    <SafeAreaProvider>
      {/* Global black background with white status bar icons */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
        <StatusBar style="light" backgroundColor="#000000" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000000" },
            statusBarStyle: "light",
            statusBarBackgroundColor: "#000000",
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
