import { KeyboardTypeOptions, StyleSheet, TextInput } from "react-native"
import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

const TEXT_INPUT_PROPS = {
    underlineColorAndroid: "transparent",
    placeholderTextColor: "#6B7280",
}

interface IFieldInputProps {
    label: string,
    onChangeText: (text: string) => void,
    value: string,
    placeholder?: string,
    disabled?: boolean,
    multiline?: boolean,
    numberOfLines?: number,
    secureTextEntry?: boolean,
    keyboardType?: KeyboardTypeOptions,
    autoCapitalize?: "none" | "sentences" | "words" | "characters",
    autoCorrect?: boolean
}

const FieldInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    disabled,
    multiline,
    numberOfLines,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    autoCorrect
}: IFieldInputProps) => {
    return (
        <ThemedView style={styles.field}>
            <ThemedText style={styles.label}>{label}</ThemedText>
            <ThemedView style={[styles.inputContainer, multiline && styles.multilineContainer, disabled && styles.disabled]}>
                <TextInput
                    style={[styles.input, multiline && styles.multilineInput]}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                    editable={!disabled}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    {...TEXT_INPUT_PROPS}
                />
            </ThemedView>
        </ThemedView>
    )
}

export default FieldInput

const styles = StyleSheet.create({
    label: {
        color: '#334155'
    },
    input: {
        width: '100%',
        borderWidth: 0,
        fontSize: 14,
        color: '#0F172A',
    },
    inputContainer: {
        backgroundColor: '#F1F5F9',
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 16,
        position: 'relative',
        borderRadius: 4,
    },
    multilineContainer: {
        minHeight: 112,
    },
    disabled: {
        opacity: 0.6
    },
    field: {
        flexDirection: 'column',
        gap: 8
    },
    multilineInput: {
        minHeight: 84,
    },
});
