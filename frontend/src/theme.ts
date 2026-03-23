import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'preconnect', sans-serif" },
        body: { value: "'preconnect', sans-serif" },
      },
      colors: {
        brand: {
          50: { value: "#f8fbd9" },
          100: { value: "#f0f7ad" },
          200: { value: "#e8f381" },
          300: { value: "#dff055" },
          400: { value: "#d6ec39" },
          500: { value: "#DBF227" },
          600: { value: "#bfd11f" },
          700: { value: "#9faa19" },
          800: { value: "#7f8413" },
          900: { value: "#5f620d" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);