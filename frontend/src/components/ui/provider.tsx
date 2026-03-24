import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { system } from "../../theme";
import { ColorModeProvider } from "./color-mode";

type ProviderProps = {
  children: ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey="crewsync-theme"
      >
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  );
}
