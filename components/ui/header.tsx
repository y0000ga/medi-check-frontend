import { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../themed-view";

const Header = ({ children }: PropsWithChildren) => {
  return <ThemedView style={styles.header}>{children}</ThemedView>;
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 1,
    height: "auto",
  },
});

export default Header;
