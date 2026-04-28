import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { evaluateDosageFormIcon } from "@/utils/common";
import { MEDICATION_DOSAGE_FORM } from "@/constants/medication";
import { useRouter } from "expo-router";
import { routes } from "@/constants/route";
import { Medication } from "@/store/medication";

interface IProps {
  medication: Medication;
  patientNameTag?: string | null;
}

const MedicationCard = ({
  medication: { id, name, dosageForm, patientName },
  patientNameTag,
}: IProps) => {
  const icon = evaluateDosageFormIcon({ dosageForm });
  const router = useRouter();
  const displayedPatientName = patientNameTag ?? patientName;

  return (
    <Pressable
      onPress={() => {
        router.push(routes.protected.modal.infoMedication(id));
      }}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: icon.backgroundColor },
            ]}
          >
            <IconSymbol
              size={24}
              name={icon.name}
              color={icon.color}
            />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.meta}>
              {MEDICATION_DOSAGE_FORM[dosageForm]}
            </Text>
          </View>
          <View style={styles.chevronWrap}>
            <IconSymbol
              size={24}
              name="chevron-right"
              color="#94A3B8"
            />
          </View>
        </View>
        {displayedPatientName ? (
          <View style={styles.footer}>
            <View style={styles.patientTag}>
              <Text style={styles.patientTagText}>
                {displayedPatientName}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
    borderRadius: 14,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  patientTag: {
    alignSelf: "flex-start",
    backgroundColor: "#F8FAFC",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  patientTagText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    color: "#0F172A",
    fontWeight: "600",
  },
  meta: {
    color: "#64748B",
  },
  chevronWrap: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 24,
    minHeight: 24,
  },
});

export default MedicationCard;
