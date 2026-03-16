import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedRef,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor?: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const scrollRef = useAnimatedRef<Animated.ScrollView>();



  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#F6FAFB'
  },
});
