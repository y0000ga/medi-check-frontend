import { Pressable, StyleSheet } from "react-native"
import { ThemedText } from "../themed-text"

interface IProps {
    tag: string,
    onPress: () => void,
    selected: boolean
}

const SymptomTag = ({ tag, onPress, selected }: IProps) => {
    return (
        <Pressable
            key={tag}
            style={[styles.tagChip, selected && styles.tagChipSelected]}
            onPress={onPress}
        >
            <ThemedText style={[styles.tagChipText, selected && styles.tagChipTextSelected]}>
                {tag}
            </ThemedText>
        </Pressable>
    )
}

export default SymptomTag

const styles = StyleSheet.create({
    tagChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: "#E2E8F0",
    },
    tagChipSelected: {
        backgroundColor: "#DBEAFE",
    },
    tagChipText: {
        color: "#334155",
        fontSize: 13,
        fontWeight: "600",
    },
    tagChipTextSelected: {
        color: "#1D4ED8",
    },
})