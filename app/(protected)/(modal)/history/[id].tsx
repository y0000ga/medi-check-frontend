import { Pressable, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { Redirect, useLocalSearchParams } from "expo-router";

import SectionCard from "@/components/history/SectionCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Container from "@/components/ui/container";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import ModalHeader from "@/components/ui/modal-header";
import { EMPTY_HISTORY_FORM } from "@/constants/history";
import { routes } from "@/constants/route";
import {
  useGetHistoryDetailQuery,
  useUpdateHistoryMutation,
} from "@/store/history";
import { EditableHistoryValues } from "@/types/history";
import { splitCustomTags, toFormValues } from "@/utils/history";
import { detailStyles } from "@/components/history/styles/detail.style";
import DetailSnapshot from "@/components/history/DetailSnapshot";
import EditableForm, {
  ReadableForm,
} from "@/components/history/EditableForm";

const HistoryDetailModal = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditableHistoryValues>(
    EMPTY_HISTORY_FORM,
  );

  const id = useMemo(
    () => (typeof params.id === "string" ? params.id : ""),
    [params.id],
  );
  const { data: history, isFetching: loading } =
    useGetHistoryDetailQuery(id, {
      skip: !id,
      refetchOnMountOrArgChange: true,
    });
  const [updateHistory, { isLoading: saving }] =
    useUpdateHistoryMutation();

  useEffect(() => {
    if (history) {
      setForm(toFormValues(history));
    }
  }, [history]);

  if (!id) {
    return <Redirect href={routes.protected.history} />;
  }

  const handleSave = async () => {
    if (!history) {
      return;
    }

    const symptomTags = [
      ...form.symptomTags,
      ...splitCustomTags(form.customSymptomTagsText),
    ]
      .filter(Boolean)
      .filter((tag, index, list) => list.indexOf(tag) === index);

    const updated = await updateHistory({
      id: history.id,
      body: {
        intake_at: form.intakenTime || null,
        taken_amount:
          form.takenAmount === "" ? 0 : Number(form.takenAmount),
        memo: form.memo.trim() || null,
        feeling:
          form.feeling.trim() === "" ? null : Number(form.feeling),
      },
    }).unwrap();

    setForm({
      ...toFormValues(updated),
      symptomTags,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!history) {
      return;
    }

    setForm(toFormValues(history));
    setIsEditing(false);
  };

  return (
    <>
      <FullScreenLoading visible={loading || saving} />
      <ThemedView style={detailStyles.container}>
        <ModalHeader
          title="History Detail"
          leftIcon={
            history ? (
              isEditing ? (
                <Pressable onPress={handleCancel}>
                  <ThemedText style={detailStyles.headerAction}>
                    Cancel
                  </ThemedText>
                </Pressable>
              ) : (
                <Pressable onPress={() => setIsEditing(true)}>
                  <IconSymbol
                    color="#3C83F6"
                    size={28}
                    name="edit"
                  />
                </Pressable>
              )
            ) : undefined
          }
        />
        <Container>
          {history ? (
            <>
              <DetailSnapshot history={history} />
              <SectionCard title="Details">
                {isEditing ? (
                  <EditableForm
                    form={form}
                    setForm={setForm}
                  />
                ) : (
                  <ReadableForm history={history} />
                )}
              </SectionCard>
            </>
          ) : (
            <View style={detailStyles.emptyState}>
              <ThemedText type="subtitle">
                History record not found
              </ThemedText>
              <ThemedText style={detailStyles.emptyText}>
                Try reopening the record from the history list.
              </ThemedText>
            </View>
          )}
        </Container>
        {history && isEditing ? (
          <Header>
            <Pressable
              style={detailStyles.saveButton}
              onPress={() => void handleSave()}
            >
              <ThemedText style={detailStyles.saveButtonText}>
                Save changes
              </ThemedText>
            </Pressable>
          </Header>
        ) : null}
      </ThemedView>
    </>
  );
};

export default HistoryDetailModal;
