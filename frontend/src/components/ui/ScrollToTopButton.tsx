import { useEffect, useState } from "react";
import { Box, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { LuArrowUp } from "react-icons/lu";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!isMobile) {
    return null;
  }

  return (
    <Box
      position="fixed"
      left="16px"
      bottom="16px"
      zIndex="overlay"
      opacity={visible ? 1 : 0}
      transform={visible ? "translateY(0)" : "translateY(8px)"}
      pointerEvents={visible ? "auto" : "none"}
      transition="opacity 0.2s ease, transform 0.2s ease"
    >
      <IconButton
        aria-label="Nach oben scrollen"
        onClick={scrollToTop}
        borderRadius="full"
        size="lg"
        bg="surface"
        color="text"
        borderWidth="1px"
        borderColor="border"
        boxShadow="lg"
        _hover={{
          bg: "mutedBg",
          borderColor: "brandAccent",
          color: "brandAccent",
        }}
        _active={{
          bg: "mutedBg",
        }}
      >
        <LuArrowUp />
      </IconButton>
    </Box>
  );
}
