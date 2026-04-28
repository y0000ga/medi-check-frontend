import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { homeStyles } from "@/components/home/styles/home.style";
import EventCard from "@/components/event-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Container from "@/components/ui/container";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { routes } from "@/constants/route";
import { useQuickCheckHistoryMutation } from "@/store/history/api";
import { useGetScheduleMatchesQuery } from "@/store/schedule/api";
import { IScheduleEvent } from "@/store/schedule/type";
import { evaluteStatus } from "@/utils/common";

const Screen = () => {
  const [expandedEventIndex, setExpandedEventIndex] = useState<number | null>(null);
  const router = useRouter();
  const [quickCheckHistory] = useQuickCheckHistoryMutation();
  const targetDate = dayjs().format("YYYY-MM-DD");
  const { data, isFetching } = useGetScheduleMatchesQuery({
    from_date: targetDate,
    to_date: targetDate,
  });
  const [localHistoryByEventId, setLocalHistoryByEventId] = useState<Record<string, { id: string; intake_at: string; status: string }>>({});
  const events = useMemo(
    () =>
      (data?.list ?? []).map((event) => ({
        ...event,
        history:
          localHistoryByEventId[`${event.schedule_id}:${event.scheduled_at}`] ?? event.history,
      })) as IScheduleEvent[],
    [data?.list, localHistoryByEventId],
  );

  const checkEvent = async (event: IScheduleEvent) => {
    try {
      const { isOperable } = evaluteStatus({
        scheduledTime: event.scheduled_at,
        intakenTime: event.history?.intake_at,
      });
      if (!isOperable || event.history) return;

      const result = await quickCheckHistory({
        medication_id: event.medication_id,
        schedule_id: event.schedule_id,
        scheduled_at: event.scheduled_at,
      }).unwrap();

      if (result.id) {
        setLocalHistoryByEventId((current) => ({
          ...current,
          [`${event.schedule_id}:${event.scheduled_at}`]: result,
        }));
      }
    } catch {}
  };

  useEffect(() => { setExpandedEventIndex(null); }, [data?.list]);

  return (
    <>
      <FullScreenLoading visible={isFetching} />
      <ThemedView style={homeStyles.container}>
        <Header>
          <ThemedText type="title">Today</ThemedText>
          <ThemedText type="subtitle" style={homeStyles.subtitle}>
            {dayjs().format("dddd, MMM DD")}
          </ThemedText>
        </Header>
        <Container>
          <View style={homeStyles.overview}>
            <View style={homeStyles.chip}>
              <Text style={homeStyles.chipText}>{events.length} REMAINING</Text>
            </View>
          </View>
          <View style={homeStyles.eventContainer}>
            {events.map((event, eventIndex) => (
              <EventCard
                key={eventIndex}
                toggleCheck={() => checkEvent(event)}
                expanded={expandedEventIndex === eventIndex}
                toggleExpanded={() => setExpandedEventIndex((current) => (current === eventIndex ? null : eventIndex))}
                onViewMedication={() => router.push(routes.protected.modal.infoMedication(event.medication_id))}
                onManage={() => router.push(routes.protected.modal.infoSchedule(event.schedule_id))}
                patientNameTag={event.patient_name}
                event={event}
              />
            ))}
          </View>
        </Container>
        <Pressable style={homeStyles.addButton} onPress={() => router.push(routes.protected.modal.createSchedule())}>
          <IconSymbol name="add" size={28} color="white" style={{ margin: "auto" }} />
        </Pressable>
      </ThemedView>
    </>
  );
};

export default Screen;
