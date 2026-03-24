import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Raleway', sans-serif" },
        body: { value: "'Raleway', sans-serif" },
      },
      colors: {
        brandLight: {
          400: { value: "#00756a" },
          500: { value: "#005C53" },
          600: { value: "#004740" },
        },
        brandDark: {
          400: { value: "#d6ec39" },
          500: { value: "#DBF227" },
          600: { value: "#bfd11f" },
        },
        secondary: {
          500: { value: "#005C53" },
        },
        night: {
          500: { value: "#042940" },
        },
        moss: {
          500: { value: "#9FC131" },
        },
        sand: {
          500: { value: "#D6D58E" },
        },
        lightbg: {
          500: { value: "#E8E8E8" },
        },
        darkbg: {
          500: { value: "#141313" },
        },
        surfaceLight: {
          500: { value: "#FFFFFF" },
        },
        surfaceDark: {
          500: { value: "#1E1D1D" },
        },
        mutedLight: {
          500: { value: "#F4F4F4" },
        },
        mutedDark: {
          500: { value: "#2A2929" },
        },
        textLight: {
          500: { value: "#141313" },
        },
        textDark: {
          500: { value: "#F5F5F5" },
        },
        textMutedLight: {
          500: { value: "#4A4A4A" },
        },
        textMutedDark: {
          500: { value: "#C9C9C9" },
        },
        borderLight: {
          500: { value: "#D9D9D9" },
        },
        borderDark: {
          500: { value: "#343333" },
        },
      },
      radii: {
        card: { value: "1rem" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          value: {
            base: "{colors.lightbg.500}",
            _dark: "{colors.darkbg.500}",
          },
        },
        surface: {
          value: {
            base: "{colors.surfaceLight.500}",
            _dark: "{colors.surfaceDark.500}",
          },
        },
        mutedBg: {
          value: {
            base: "{colors.mutedLight.500}",
            _dark: "{colors.mutedDark.500}",
          },
        },
        text: {
          value: {
            base: "{colors.textLight.500}",
            _dark: "{colors.textDark.500}",
          },
        },
        textMuted: {
          value: {
            base: "{colors.textMutedLight.500}",
            _dark: "{colors.textMutedDark.500}",
          },
        },
        border: {
          value: {
            base: "{colors.borderLight.500}",
            _dark: "{colors.borderDark.500}",
          },
        },
        brandAccent: {
          value: {
            base: "{colors.brandLight.500}",
            _dark: "{colors.brandDark.500}",
          },
        },
        brandAccentHover: {
          value: {
            base: "{colors.brandLight.400}",
            _dark: "{colors.brandDark.400}",
          },
        },
        brandAccentActive: {
          value: {
            base: "{colors.brandLight.600}",
            _dark: "{colors.brandDark.600}",
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);