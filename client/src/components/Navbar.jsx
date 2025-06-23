import { Box, Flex, Spacer, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <Flex bg="blue.600" p={4} color="white" align="center">
      <Text fontSize="xl" fontWeight="bold">🧠 Resume AI</Text>
      <Spacer />
      <Button colorScheme="whiteAlpha" variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </Flex>
  );
}
