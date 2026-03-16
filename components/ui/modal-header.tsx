import { PropsWithChildren, ReactElement } from "react"
import Header from "./header"
import { ThemedView } from "../themed-view"
import { useRouter } from "expo-router"
import { Pressable } from "react-native"
import { IconSymbol } from "./icon-symbol"
import { ThemedText } from "../themed-text"

const ModalHeader = ({ title, leftIcon }: PropsWithChildren<{ title: string, leftIcon?: ReactElement }>) => {
    const router = useRouter()
    return <Header>
        <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <ThemedView style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
                <Pressable onPress={() => { router.back() }}>
                    <IconSymbol name="arrow-back" size={28} color="#64748B" />
                </Pressable>
                <ThemedText type="subtitle" style={{ lineHeight: 27 }}>
                    {title}
                </ThemedText>
            </ThemedView>
            {leftIcon && leftIcon}
        </ThemedView>
    </Header>
}

export default ModalHeader