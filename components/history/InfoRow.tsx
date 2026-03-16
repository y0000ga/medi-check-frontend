import { StyleSheet } from "react-native"
import { ThemedView } from "../themed-view"
import { ThemedText } from "../themed-text"

const InfoRow = ({ value, label }: { value: string, label: string }) => {
    return (
        <ThemedView style={styles.row}>
            <ThemedText style={styles.label}>{label}</ThemedText>
            <ThemedText style={styles.value}>{value}</ThemedText>
        </ThemedView>
    )
}

export default InfoRow

const styles = StyleSheet.create({
    row: {
        gap: 6,
    },
    label: {
        color: "#64748B",
        fontWeight: "600",
    },
    value: {
        color: "#0F172A",
    },
})