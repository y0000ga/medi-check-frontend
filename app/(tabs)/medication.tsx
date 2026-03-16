import { Pressable, StyleSheet, TextInput } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import Header from '@/components/ui/header';
import Container from '@/components/ui/container';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import MedicationCard from '@/components/medication-card';
import FullScreenLoading from '@/components/ui/fullscreen-loading';
import { useMedicationStore } from '@/stores/medication';
import { useViewerStore } from '@/stores/viewer';

const Screen = () => {
  const [search, setSearch] = useState('')
  const medications = useMedicationStore((state) => state.medications)
  const loadMedications = useMedicationStore((state) => state.loadMedications)
  const medicationLoading = useMedicationStore((state) => state.isLoading.length > 0)
  const viewerMode = useViewerStore((state) => state.mode)
  const selfPatient = useViewerStore((state) => state.ownPatient)
  const carePatients = useViewerStore((state) => state.carePatients)
  const selectedPatientId = useViewerStore((state) => state.selectedPatientId)
  const router = useRouter()

  const getPatientNameTag = (patientId: string) => {
    if (viewerMode !== 'caregiver') {
      return null
    }

    if (selectedPatientId) {
      return carePatients.find((item) => item.patientId === selectedPatientId)?.patientName ?? null
    }

    return carePatients.find((item) => item.patientId === patientId)?.patientName ?? null
  }

  const filteredMedications = useMemo(() => {
    if (viewerMode === 'self') {
      return medications.filter((medication) => medication.patientId === selfPatient?.id)
    }

    if (selectedPatientId) {
      return medications.filter((medication) => medication.patientId === selectedPatientId)
    }

    const carePatientIds = new Set(carePatients.map((item) => item.patientId))
    return medications.filter((medication) => carePatientIds.has(medication.patientId))
  }, [carePatients, medications, selectedPatientId, selfPatient?.id, viewerMode])

  useEffect(() => {
    const process = async () => {
      await loadMedications({ search })
    }

    process()
  }, [loadMedications, search])

  return (
    <>
      <FullScreenLoading visible={medicationLoading} />
      <ThemedView style={styles.container}>
        <Header>
          <ThemedText type="title">藥品</ThemedText>
          <ThemedView style={styles.inputContainer}>
            <IconSymbol
              name="search"
              size={20}
              color="#6B7280"
              style={{ position: 'absolute', top: 10, left: 12 }}
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => { setSearch(text) }}
              underlineColorAndroid="transparent"
              placeholderTextColor="#6B7280"
              value={search}
              placeholder="搜尋藥物名稱或備註"
            />
          </ThemedView>
        </Header>
        <Container>
          {filteredMedications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              patientNameTag={getPatientNameTag(medication.patientId)}
            />
          ))}
        </Container>
        <Pressable style={styles.addButton} onPress={() => { router.push('/medication/create') }}>
          <IconSymbol name="add" size={28} color="white" style={{ margin: 'auto' }} />
        </Pressable>
      </ThemedView>
    </>
  );
}

export default Screen

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  inputContainer: {
    backgroundColor: '#F1F5F9',
    width: '100%',
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 12,
    position: 'relative',
    borderRadius: 8
  },
  addButton: {
    position: 'fixed',
    right: 16,
    bottom: 56,
    elevation: 4,
    borderRadius: 100,
    width: 56,
    aspectRatio: 1,
    backgroundColor: '#3C83F6',
    borderWidth: 4,
    borderColor: 'white',
  },
  input: {
    backgroundColor: '#F1F5F9',
    width: '100%',
    borderWidth: 0,
  },
});
