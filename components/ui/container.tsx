import { ScrollView, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";

const Container = ({ children }: PropsWithChildren) => {
  return (
    <ScrollView
      style={{ marginBottom: 24 }}
      contentContainerStyle={styles.container}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "column",
    gap: 16,
    backgroundColor: "transparent",
    flex: 1,
    paddingVertical: 24,

    paddingHorizontal: 16,
  },
});

export default Container;
