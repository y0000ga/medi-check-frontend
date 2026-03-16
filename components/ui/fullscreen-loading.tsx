import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from '../themed-view';
import { ThemedText } from '../themed-text';

interface FullScreenLoadingProps {
    visible: boolean;
    text?: string;
}

export default function FullScreenLoading({
    visible,
    text,
}: FullScreenLoadingProps) {
    if (!visible) return null;

    return (
        <ThemedView style={styles.overlay}>
            {text ?
                <ThemedView style={styles.card}>
                    <ActivityIndicator size="large" color="#3C83F6" />
                    <ThemedText style={styles.text}>{text}</ThemedText>
                </ThemedView> :
                <ActivityIndicator size="large" color="#3C83F6" />
            }
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.24)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    card: {
        minWidth: 160,
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
    },
    text: {
        fontSize: 15,
        color: '#334155',
        fontWeight: '500',
    },
});
