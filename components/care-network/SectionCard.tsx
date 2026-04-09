import { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../themed-view";
import { ThemedText } from "../themed-text";

const SectionCard = ({
  children,
  title,
}: PropsWithChildren<{ title: string }>) => {
  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </ThemedView>
  );
};

export default SectionCard;

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
});
