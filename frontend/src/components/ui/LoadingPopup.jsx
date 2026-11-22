import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const popIn = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

export default function LoadingPopup({ open, message = "Loading...", isSuccess = false }) {
  if (!open) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={9999}
      bg="blackAlpha.50"
      backdropFilter="blur(4px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="white"
        borderRadius="xl"
        px={10}
        py={8}
        shadow="2xl"
        border="1px solid"
        borderColor="border"
        textAlign="center"
        minW="220px"
      >
        <VStack gap={4}>
          {isSuccess ? (
            <Box
              animation={`${popIn} 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="50px"
              h="50px"
            >
              <svg width="48" height="48" viewBox="0 0 512 512" fill="#0be5e5">
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
              </svg>
            </Box>
          ) : (
            <Spinner size="xl" color="primary" borderWidth="3px" />
          )}
          <Text
            fontWeight="semibold"
            color={isSuccess ? "#0be5e5" : "foreground"}
            fontSize="sm"
            transition="color 300ms ease"
          >
            {message}
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}