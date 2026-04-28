import { HISTORY_STATUS_LABEL } from "@/constants/history";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { IconSymbol } from "../ui/icon-symbol";
import { detailStyles } from "./styles/detail.style";
import SectionCard from "./SectionCard";
import { useRouter } from "expo-router";
import InfoRow from "./InfoRow";
import { Pressable } from "react-native";
import { HistoryDetail } from "@/store/history";
import { evaluateLabel } from "@/utils/common";
import { routes } from "@/constants/route";
import { formatDateTime } from "@/utils/history";

const DetailSnapshot = ({ history }: { history: HistoryDetail }) => {
  const router = useRouter();

  const { icon, label: amountLabel } = evaluateLabel({
    medicationDosageForm: history.medicationDosageForm,
    doseUnit: history.doseUnit,
    amount: history.amount,
  });

  return (
    <>
      <ThemedView style={detailStyles.heroCard}>
        <ThemedView
          style={[
            detailStyles.heroIcon,
            { backgroundColor: icon.backgroundColor },
          ]}
        >
          <IconSymbol
            size={26}
            name={icon.name}
            color={icon.color}
          />
        </ThemedView>
        <ThemedView style={detailStyles.heroContent}>
          <ThemedText type="subtitle">
            {history.medicationName}
          </ThemedText>
          <ThemedText style={detailStyles.heroMeta}>
            {HISTORY_STATUS_LABEL[history.status]}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <SectionCard title="基本資訊">
        {/* <InfoRow
                  label="歷史紀錄 ID"
                  value={history.id}
                /> */}
        <InfoRow
          label="病患名稱"
          value={history.patientName || ""}
        />
        {/* 之後有病患詳細頁面再接上去 */}
        {/* <InfoRow
                  label="病患 ID"
                  value={history.patientId}
                /> */}
        <Pressable
          onPress={() => {
            if (!history.medicationId) {
              return;
            }
            router.push(
              routes.protected.modal.infoMedication(
                history.medicationId,
              ),
            );
          }}
        >
          <InfoRow
            label="藥物名稱"
            value={history.medicationName}
          />
        </Pressable>
        {/* TODO: 多一個按鈕，檢視排程 */}
        {/* <InfoRow
            label="排程 ID"
            value={history.scheduleId}
        /> */}
        <InfoRow
          label="排程劑量與劑型"
          value={amountLabel}
        />
        <InfoRow
          label="排程時間"
          value={formatDateTime(history.scheduledTime)}
        />
      </SectionCard>
    </>
  );
};

export default DetailSnapshot;
