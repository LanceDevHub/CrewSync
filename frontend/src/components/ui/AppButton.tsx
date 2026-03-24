import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type AppButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type AppButtonProps = ButtonProps & {
  children: ReactNode;
  appVariant?: AppButtonVariant;
};

function getVariantStyles(appVariant: AppButtonVariant): ButtonProps {
  switch (appVariant) {
    case "primary":
      return {
        variant: "outline",
        borderColor: "brandAccent",
        color: "brandAccent",
        bg: "transparent",
        _hover: {
          bg: "mutedBg",
          borderColor: "brandAccentHover",
          color: "brandAccentHover",
        },
        _active: {
          bg: "mutedBg",
          borderColor: "brandAccentActive",
          color: "brandAccentActive",
        },
      };

    case "secondary":
      return {
        variant: "ghost",
        color: "text",
        bg: "transparent",
        _hover: {
          bg: "mutedBg",
          color: "brandAccent",
        },
        _active: {
          bg: "mutedBg",
          color: "brandAccentActive",
        },
      };

    case "danger":
      return {
        variant: "outline",
        borderColor: "red.500",
        color: "red.500",
        bg: "transparent",
        _hover: {
          bg: "red.50",
          borderColor: "red.600",
          color: "red.600",
        },
        _active: {
          bg: "red.100",
        },
      };

    case "ghost":
    default:
      return {
        variant: "ghost",
        color: "text",
        bg: "transparent",
        _hover: {
          bg: "mutedBg",
        },
      };
  }
}

export default function AppButton({
  children,
  appVariant = "primary",
  size = "sm",
  borderRadius = "md",
  fontWeight = "medium",
  ...props
}: AppButtonProps) {
  const variantStyles = getVariantStyles(appVariant);

  return (
    <Button
      size={size}
      borderRadius={borderRadius}
      fontWeight={fontWeight}
      transition="all 0.2s ease"
      {...variantStyles}
      {...props}
    >
      {children}
    </Button>
  );
}
