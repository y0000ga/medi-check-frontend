import { Stack } from "expo-router";

const ProtectedModalLayout = () => {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        headerShown: false,
      }}
    />
  );
};

export default ProtectedModalLayout;
