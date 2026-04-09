import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

const MONTH_DAYS = Array.from({
  length: Number(dayjs().endOf("month").format("DD")),
}).map((_, index) => index + 1 - Number(dayjs().format("DD")));
const TODAY_INDEX = MONTH_DAYS.findIndex((item) => item === 0);

const CARD_WIDTH = 56;
const CARD_GAP = 12;

const DateCalendar = () => {
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const positions = useRef<Record<string, number>>({}).current;

  useEffect(() => {
    if (TODAY_INDEX >= 0 && containerWidth > 0) {
      const cardCenterX =
        TODAY_INDEX * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2;

      scrollRef.current?.scrollTo({
        x: Math.max(0, cardCenterX - containerWidth / 2),
        animated: true,
      });
    }
  }, [containerWidth, scrollRef]);

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}
      scrollEventThrottle={16}
      style={{ flexGrow: 0, paddingVertical: 8 }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      contentContainerStyle={{
        gap: CARD_GAP,
      }}
    >
      {MONTH_DAYS.map((item) => {
        const date = dayjs().add(item, "days");
        const today = dayjs().format("DD");
        const isToday = date.format("DD") === today;
        const isBefore = date.isBefore(dayjs());
        return (
          <View
            key={date.toISOString()}
            onLayout={(e) => {
              positions[date.toISOString()] = e.nativeEvent.layout.x;
            }}
            style={{
              ...styles.dateCard,
              ...(isBefore ? { opacity: 0.6 } : {}),
              ...(isToday
                ? {
                    backgroundColor: "#3C83F6",
                    transform: [{ scale: 1.1 }],
                  }
                : { backgroundColor: "white" }),
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                ...(isToday
                  ? { color: "white", fontSize: 16 }
                  : { fontSize: 12, color: "#94A3B8" }),
              }}
            >
              {date.format("ddd")}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                ...(isToday
                  ? { color: "white", fontSize: 18 }
                  : { fontSize: 16 }),
              }}
            >
              {date.format("DD")}
            </Text>
            {isToday && (
              <View
                style={{
                  aspectRatio: 1,
                  width: 8,
                  backgroundColor: "white",
                  borderRadius: 999,
                }}
              />
            )}
          </View>
        );
      })}
    </Animated.ScrollView>
  );
};

export default DateCalendar;

const styles = StyleSheet.create({
  dateCard: {
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 1,
    borderRadius: 8,
    width: CARD_WIDTH,
    aspectRatio: 7 / 10,
  },
});
