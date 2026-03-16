import { useState } from "react"
import { ThemedView } from "../themed-view"
import { ThemedText } from "../themed-text"
import { Modal, Pressable, StyleSheet } from "react-native"

interface IFieldPickerProps<T> {
  label: string,
  value: T,
  onValueChange: (itemValue: T, itemIndex: number) => void,
  options: { label: string, value: T }[]
  placeholder?: string,
  disabled?: boolean
}

const FieldPicker = <T extends string>({
  placeholder,
  label,
  value,
  onValueChange,
  options,
  disabled
}: IFieldPickerProps<T>) => {
  const [visible, setVisible] = useState(false)
  const selectedOption = options.find((option) => option.value === value)

  return (
    <ThemedView style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable
        style={[styles.inputContainer, disabled && styles.disabled]}
        onPress={() => { !disabled && setVisible(true) }}
        disabled={disabled}
      >
        <ThemedText style={[styles.input, !selectedOption && styles.placeholder]}>
          {selectedOption?.label ?? placeholder ?? ''}
        </ThemedText>
      </Pressable>
      <Modal
        animationType="fade"
        transparent
        visible={visible && !disabled}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <ThemedView style={styles.pickerSheet}>
            {options.map((option, index) => (
              <Pressable
                key={option.value}
                style={[
                  styles.optionButton,
                  index !== options.length - 1 && styles.optionDivider,
                ]}
                onPress={() => {
                  onValueChange(option.value, index)
                  setVisible(false)
                }}
              >
                <ThemedText style={styles.optionText}>{option.label}</ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </Pressable>
      </Modal>
    </ThemedView>
  )
}

const styles = StyleSheet.create({

  label: {
    color: '#334155'
  },
  input: {
    width: '100%',
    borderWidth: 0,
    fontSize: 14
  },
  inputContainer: {
    backgroundColor: '#F1F5F9',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    position: 'relative',
    borderRadius: 4
  },
  placeholder: {
    color: '#6B7280'
  },
  field: {
    flexDirection: 'column',
    gap: 8
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.18)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pickerSheet: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    fontSize: 14
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  disabled: {
    opacity: 0.6
  },
  optionText: {
    color: '#0F172A',
    fontSize: 14
  }
});

export default FieldPicker