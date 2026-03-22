import { createSystem, defaultConfig } from "@chakra-ui/react";

const config = {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f4f1" },
          100: { value: "#b3ddd3" },
          200: { value: "#80c5b5" },
          300: { value: "#4dad97" },
          400: { value: "#1a9679" },
          500: { value: "#DBF227" },
          600: { value: "#00664c" },
          700: { value: "#004c39" },
          800: { value: "#003326" },
          900: { value: "#001a13" },
        },
      },
    },
  },
};

export const system = createSystem(defaultConfig, config);