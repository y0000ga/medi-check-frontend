import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import EventCard from "@/components/event-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Container from "@/components/ui/container";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { routes } from "@/constants/route";
import { fetchScheduleEvents } from "@/libs/api/schedule";
import { useViewerStore } from "@/stores/viewer";
import { IRES_Event } from "@/types/api";
import { evaluteStatus } from "@/utils/common";
import { IScheduleEvent } from "@/types/api/schedule";

const Screen = () => {
  const [events, setEvents] = useState<IScheduleEvent[]>([]);
  const [expandedEventIndex, setExpandedEventIndex] = useState<
    number | null
  >(null);
  const router = useRouter();
  const viewerMode = useViewerStore((state) => state.mode);
  const carePatients = useViewerStore((state) => state.carePatients);
  const selectedPatientId = useViewerStore(
    (state) => state.selectedPatientId,
  );

  useEffect(() => {
    const loadEvents = async () => {
      const targetDate = dayjs();
      const eventList = await fetchScheduleEvents({
        date: targetDate.toISOString(),
      });
      setEvents(eventList);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    setExpandedEventIndex(null);
  }, [viewerMode, selectedPatientId]);

  const checkEvent = (event: IScheduleEvent, eventIndex: number) => {
    const { isOperable } = evaluteStatus({
      scheduledTime: event.scheduled_at,
      intakenTime: event.history?.intake_at,
    });

    if (!isOperable) {
      return;
    }

    // 更新打 API 然後 reload

    // setEvents((prev) =>
    //   prev.map((item, itemIndex) =>
    //     item.inke === eventIndex
    //       ? {
    //           ...item,
    //           intakenTime: item.intakenTime
    //             ? null
    //             : dayjs().toISOString(),
    //         }
    //       : item,
    //   ),
    // );
  };

  return (
    <>
      <FullScreenLoading visible={false} />
      <ThemedView style={styles.container}>
        <Header>
          <ThemedText type="title">Today</ThemedText>
          <ThemedText
            type="subtitle"
            style={styles.subtitle}
          >
            {dayjs().format("dddd, MMM DD")}
          </ThemedText>
        </Header>
        <Container>
          <View style={styles.overview}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {events.length} REMAINING
              </Text>
            </View>
          </View>
          <View style={styles.eventContainer}>
            {events.map((event, eventIndex) => (
              <EventCard
                key={eventIndex}
                toggleCheck={() => checkEvent(event, eventIndex)}
                expanded={expandedEventIndex === eventIndex}
                toggleExpanded={() => {
                  setExpandedEventIndex((current) =>
                    current === eventIndex ? null : eventIndex,
                  );
                }}
                onViewMedication={() =>
                  router.push(
                    routes.protected.modal.infoMedication(
                      event.medication_id,
                    ),
                  )
                }
                onManage={() =>
                  router.push(
                    routes.protected.modal.infoSchedule(
                      event.schedule_id,
                    ),
                  )
                }
                patientNameTag={event.patient_name}
                event={event}
              />
            ))}
          </View>
        </Container>
        <Pressable
          style={styles.addButton}
          onPress={() => {
            router.push(routes.protected.modal.createSchedule());
          }}
        >
          <IconSymbol
            name="add"
            size={28}
            color="white"
            style={{ margin: "auto" }}
          />
        </Pressable>
      </ThemedView>
    </>
  );
};

export default Screen;

const styles = StyleSheet.create({
  chip: {
    borderRadius: 50,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipText: {
    color: "#3c83F6",
    fontWeight: "600",
  },
  overview: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  subtitle: {
    color: "#64748B",
    fontWeight: "400",
  },
  eventContainer: { flexDirection: "column", gap: 16 },
  container: {
    width: "100%",
    flex: 1,
  },
  addButton: {
    position: "fixed",
    right: 16,
    bottom: 56,
    elevation: 4,
    borderRadius: 100,
    width: 56,
    aspectRatio: 1,
    backgroundColor: "#3C83F6",
    borderWidth: 4,
    borderColor: "white",
  },
});
