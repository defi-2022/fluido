import {
  Container,
  Box,
  Heading,
  Grid,
  Button,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface PositionsProps {}

export const Positions: React.FC<PositionsProps> = () => {
  let navigate = useNavigate();

  return (
    <Container w={"full"} centerContent>
      <Box h={"10"} />
      <Box w={"container.xl"}>
        <HStack>
          <Button
            variant={"solid"}
            mr={"5px"}
            onClick={() => {
              navigate("/tokens");
            }}
          >
            <AiOutlineArrowLeft></AiOutlineArrowLeft>
          </Button>
          <Heading mb={"4"}>Your positions</Heading>
        </HStack>
        <Box h={"2"} />
        <Grid templateColumns="repeat(2, 1fr)" gap={6}></Grid>
      </Box>
    </Container>
  );
};
