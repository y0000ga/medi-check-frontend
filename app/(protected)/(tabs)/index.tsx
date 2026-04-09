import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import EventCard from "@/components/event-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Container from "@/components/ui/container";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { routes } from "@/constants/route";
import { fetchHistories } from "@/libs/api/history";
import { fetchMedications } from "@/libs/api/medication";
import { fetchSchedules } from "@/libs/api/schedule";
import { useViewerStore } from "@/stores/viewer";
import { IRES_Event } from "@/types/api";
import { evaluteStatus } from "@/utils/common";
import { deriveEventsFromClientData } from "@/utils/occurrence";

const Screen = () => {
  const [events, setEvents] = useState<IRES_Event[]>([]);
  const [expandedEventId, setExpandedEventId] = useState<
    string | null
  >(null);
  const router = useRouter();
  const viewerMode = useViewerStore((state) => state.mode);
  const selfPatient = useViewerStore((state) => state.ownPatient);
  const carePatients = useViewerStore((state) => state.carePatients);
  const selectedPatientId = useViewerStore(
    (state) => state.selectedPatientId,
  );

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      const targetDate = dayjs();
      const [schedules, medications, histories] = await Promise.all([
        fetchSchedules({ date: targetDate.toISOString() }),
        fetchMedications({}),
        fetchHistories(targetDate.toISOString()),
      ]);

      const items = deriveEventsFromClientData({
        schedules,
        medications: medications.list,
        histories,
        targetDate,
      });

      if (!active) {
        return;
      }

      setEvents(items);
    };

    loadEvents();

    return () => {
      active = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    if (viewerMode === "self") {
      return events.filter(
        (event) => event.patientId === selfPatient?.id,
      );
    }

    if (selectedPatientId) {
      return events.filter(
        (event) => event.patientId === selectedPatientId,
      );
    }

    const carePatientIds = new Set(
      carePatients.map((item) => item.patientId),
    );
    return events.filter((event) =>
      carePatientIds.has(event.patientId),
    );
  }, [
    carePatients,
    events,
    selectedPatientId,
    selfPatient?.id,
    viewerMode,
  ]);

  useEffect(() => {
    setExpandedEventId(null);
  }, [viewerMode, selectedPatientId]);

  const getPatientNameTag = (event: IRES_Event) => {
    if (viewerMode !== "caregiver") {
      return null;
    }

    if (selectedPatientId) {
      return (
        carePatients.find(
          (item) => item.patientId === selectedPatientId,
        )?.patientName ?? null
      );
    }

    return (
      event.patientName ||
      (carePatients.find((item) => item.patientId === event.patientId)
        ?.patientName ??
        null)
    );
  };

  const checkEvent = (event: IRES_Event) => {
    const { isOperable } = evaluteStatus(event);

    if (!isOperable) {
      return;
    }

    setEvents((prev) =>
      prev.map((item) =>
        event.id === item.id
          ? {
              ...item,
              intakenTime: item.intakenTime
                ? null
                : dayjs().toISOString(),
            }
          : item,
      ),
    );
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
                {filteredEvents.length} REMAINING
              </Text>
            </View>
          </View>
          <View style={styles.eventContainer}>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                toggleCheck={() => checkEvent(event)}
                expanded={expandedEventId === event.id}
                toggleExpanded={() => {
                  setExpandedEventId((current) =>
                    current === event.id ? null : event.id,
                  );
                }}
                onViewMedication={() =>
                  router.push(
                    routes.protected.modal.infoMedication(
                      event.medicationId,
                    ),
                  )
                }
                onManage={() =>
                  router.push(
                    routes.protected.modal.infoSchedule(
                      event.scheduleId,
                    ),
                  )
                }
                patientNameTag={getPatientNameTag(event)}
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
