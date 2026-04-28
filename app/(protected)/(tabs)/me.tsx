import { useMemo } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import { meStyles } from "@/components/me/styles/me.style";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Container from "@/components/ui/container";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import { routes } from "@/constants/route";
import { SETTING_MENU_ITEMS } from "@/constants/user";
import { useAuthFlows, useCurrentUser } from "@/store/user";

const MeScreen = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const { signOut } = useAuthFlows();

  const initials = useMemo(() => {
    const source = currentUser?.name || "Medi Check";
    return source.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
  }, [currentUser?.name]);

  const handleLogout = async () => {
    await signOut();
    router.replace(routes.public.signIn);
  };

  const handlePress = (key: (typeof SETTING_MENU_ITEMS)[number]["key"]) => {
    const targetRoute = {
      profile: routes.protected.modal.profile,
      security: routes.protected.modal.security,
      "patient-care": routes.protected.modal.patientCare,
      "invitation-management": routes.protected.modal.invitationManagement,
    } as const;
    router.push(targetRoute[key]);
  };

  return (
    <>
      <FullScreenLoading visible={false} />
      <ThemedView style={meStyles.screen}>
        <Header>
          <ThemedText type="title">個人設定</ThemedText>
        </Header>
        <Container>
          {currentUser ? (
            <>
              <View style={meStyles.profileCard}>
                <View style={meStyles.avatar}>
                  <ThemedText style={meStyles.avatarText}>{initials}</ThemedText>
                </View>
                <View style={meStyles.profileMeta}>
                  <ThemedText type="subtitle" style={meStyles.profileName}>
                    {currentUser.name}
                  </ThemedText>
                  <ThemedText style={meStyles.profileEmail}>{currentUser.email}</ThemedText>
                </View>
              </View>
              <View style={meStyles.menuCard}>
                {SETTING_MENU_ITEMS.map((item, index) => (
                  <Pressable
                    key={item.key}
                    style={[meStyles.menuItem, index === SETTING_MENU_ITEMS.length - 1 && meStyles.menuItemLast]}
                    onPress={() => handlePress(item.key)}
                  >
                    <View style={meStyles.menuText}>
                      <ThemedText style={meStyles.menuTitle}>{item.title}</ThemedText>
                      <ThemedText style={meStyles.menuDescription}>{item.description}</ThemedText>
                    </View>
                    <ThemedText style={meStyles.menuArrow}>??</ThemedText>
                  </Pressable>
                ))}
              </View>
              <Pressable style={meStyles.logoutButton} onPress={handleLogout}>
                <ThemedText style={meStyles.logoutButtonText}>?餃</ThemedText>
              </Pressable>
            </>
          ) : (
            <View style={meStyles.emptyCard}>
              <ThemedText type="subtitle">撠?餃撣唾?</ThemedText>
              <ThemedText style={meStyles.emptyText}>
                ?餃敺?舀?犖閮剖??炎閬澈???折“????
              </ThemedText>
              <Pressable style={meStyles.loginButton} onPress={() => router.replace(routes.public.signIn)}>
                <ThemedText style={meStyles.loginButtonText}>???餃</ThemedText>
              </Pressable>
            </View>
          )}
        </Container>
      </ThemedView>
    </>
  );
};

export default MeScreen;
