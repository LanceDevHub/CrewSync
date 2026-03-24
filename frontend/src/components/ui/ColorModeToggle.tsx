import { useTheme } from "next-themes";
import { ClientOnly, Text } from "@chakra-ui/react";

import AppButton from "./AppButton";

export default function ColorModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <ClientOnly fallback={<AppButton appVariant="ghost">Theme</AppButton>}>
      <AppButton
        appVariant="ghost"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        <Text as="span">{isDark ? "Light Mode" : "Dark Mode"}</Text>
      </AppButton>
    </ClientOnly>
  );
}
