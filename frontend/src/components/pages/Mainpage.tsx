import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";

interface MainpageProps {}

export const Mainpage: React.FC<MainpageProps> = () => {
  const navigate = useNavigate();

  return (
    <Container w="full" centerContent>
      <Box h={120} w="full" />
      <Box w="container.xl">
        <Heading size="3xl" lineHeight="1.4">
          Backed tokens and yield farming on{" "}
          <Button
            variant="link"
            size="4xl"
            textColor="green.300"
            fontWeight="bold"
          >
            Theta Network
          </Button>
        </Heading>
        <Box h={6} w="full" />
        <Button
          w="60"
          h="14"
          onClick={() => {
            navigate("/tokens");
          }}
        >
          Try for free
        </Button>
        <Box h={"20"} />
        <Center>
          <Flex direction={"column"}>
            <Text mb={"-8"}>Next season</Text>
            <Countdown
              className="text-[7rem] font-thin"
              date={Date.now() + 10000000}
            />
          </Flex>
        </Center>
      </Box>
    </Container>
  );
};
