import { Redirect } from "expo-router";

import { routes } from "@/constants/route";

const IndexScreen = () => <Redirect href={routes.public.signIn} />;

export default IndexScreen;
