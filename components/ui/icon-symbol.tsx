import { MaterialIcons } from "@expo/vector-icons";
import { SymbolWeight } from "expo-symbols";
import {
  OpaqueColorValue,
  type StyleProp,
  type TextStyle,
} from "react-native";

export const IconSymbol = ({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) => {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={name}
      style={style}
    />
  );
};
