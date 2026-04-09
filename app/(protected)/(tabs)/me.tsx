import { Pressable, StyleSheet, View } from "react-native";
import { useMemo } from "react";
import { useRouter } from "expo-router";

import Container from "@/components/ui/container";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import { routes } from "@/constants/route";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useUserStore } from "@/stores/user";
import { useViewerStore } from "@/stores/viewer";
import { SETTING_MENU_ITEMS } from "@/constants/user";

const MeScreen = () => {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.currentUser);
  const userLoading = useUserStore(
    (state) => state.isLoading.length > 0,
  );

  const mode = useViewerStore((state) => state.mode);
  const carePatients = useViewerStore((state) => state.carePatients);
  const selectedPatientId = useViewerStore(
    (state) => state.selectedPatientId,
  );
  const viewerLoading = useViewerStore((state) => state.isLoading);
  const logout = useUserStore((state) => state.logout);

  const initials = useMemo(() => {
    const source = currentUser?.name || "Medi Check";

    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [currentUser?.name]);

  const handleLogout = async () => {
    await logout();
    router.replace(routes.public.signIn);
  };

  const viewerSummary = useMemo(() => {
    if (mode === "self") {
      return "目前查看：我的服藥";
    }

    if (selectedPatientId) {
      const patient = carePatients.find(
        (item) => item.patientId === selectedPatientId,
      );
      return patient
        ? `目前查看：${patient.patientName}`
        : "目前查看：照顧者視角";
    }

    return "目前查看：全部病人";
  }, [carePatients, mode, selectedPatientId]);

  const handlePress = (
    key: (typeof SETTING_MENU_ITEMS)[number]["key"],
  ) => {
    const targetRoute = {
      viewer: routes.protected.modal.viewer,
      profile: routes.protected.modal.profile,
      security: routes.protected.modal.security,
      "care-network": routes.protected.modal.careNetwork,
    } as const;

    router.push(targetRoute[key]);
  };

  return (
    <>
      <FullScreenLoading visible={userLoading || viewerLoading} />
      <ThemedView style={styles.screen}>
        <Header>
          <ThemedText type="title">我的設定</ThemedText>
          <ThemedText style={styles.subtitle}>
            管理帳號、檢視身分與照顧關係。
          </ThemedText>
        </Header>

        <Container>
          {currentUser ? (
            <>
              <View style={styles.profileCard}>
                <View style={styles.avatar}>
                  <ThemedText style={styles.avatarText}>
                    {initials}
                  </ThemedText>
                </View>
                <View style={styles.profileMeta}>
                  <ThemedText
                    type="subtitle"
                    style={styles.profileName}
                  >
                    {currentUser.name}
                  </ThemedText>
                  <ThemedText style={styles.profileEmail}>
                    {currentUser.email}
                  </ThemedText>
                  <ThemedText style={styles.profileHint}>
                    {viewerSummary}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.menuCard}>
                {SETTING_MENU_ITEMS.map((item, index) => (
                  <Pressable
                    key={item.key}
                    style={[
                      styles.menuItem,
                      index === SETTING_MENU_ITEMS.length - 1 &&
                        styles.menuItemLast,
                    ]}
                    onPress={() => handlePress(item.key)}
                  >
                    <View style={styles.menuText}>
                      <ThemedText style={styles.menuTitle}>
                        {item.title}
                      </ThemedText>
                      <ThemedText style={styles.menuDescription}>
                        {item.description}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.menuArrow}>
                      ›
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
              <Pressable
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <ThemedText style={styles.logoutButtonText}>
                  登出
                </ThemedText>
              </Pressable>
            </>
          ) : (
            <View style={styles.emptyCard}>
              <ThemedText type="subtitle">尚未登入帳號</ThemedText>
              <ThemedText style={styles.emptyText}>
                登入後即可查看個人設定、檢視身分與照顧關係。
              </ThemedText>
              <Pressable
                style={styles.loginButton}
                onPress={() => router.replace(routes.public.signIn)}
              >
                <ThemedText style={styles.loginButtonText}>
                  前往登入
                </ThemedText>
              </Pressable>
            </View>
          )}
        </Container>
      </ThemedView>
    </>
  );
};

export default MeScreen;

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  subtitle: {
    color: "#64748B",
    fontWeight: "400",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#2563EB",
    fontSize: 22,
    fontWeight: "700",
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: "#0F172A",
  },
  profileEmail: {
    color: "#64748B",
  },
  profileHint: {
    color: "#2563EB",
    fontWeight: "600",
  },
  menuCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    flex: 1,
    gap: 4,
  },
  menuTitle: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 15,
  },
  menuDescription: {
    color: "#64748B",
    lineHeight: 20,
  },
  menuArrow: {
    color: "#94A3B8",
    fontSize: 24,
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyText: {
    color: "#64748B",
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: "#3C83F6",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "700",
  },
  logoutButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
  },
  logoutButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
});
