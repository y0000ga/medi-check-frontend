import { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../themed-view";
import { ThemedText } from "../themed-text";

const SectionCard = ({ title, children }: PropsWithChildren<{ title: string }>) => {
    return (
        <ThemedView style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
            {children}
        </ThemedView>
    )
}

export default SectionCard

const styles = StyleSheet.create({
    sectionCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 18,
        gap: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 1,
    },
    sectionTitle: {
        color: "#0F172A",
        fontWeight: "700",
    },
})