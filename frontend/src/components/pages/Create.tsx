import {
  Container,
  Box,
  Heading,
  Grid,
  Input,
  Text,
  Select,
  GridItem,
  Flex,
  HStack,
  Divider,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContracts } from "../../stores/useContracts";

interface CreateProps {}

export const Create: React.FC<CreateProps> = () => {
  let navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [interest, setInterest] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const factory = useContracts((state) => state.factory);

  const handleCreateToken = async () => {
    try {
      if (!factory) {
        throw new Error("Failed to initalize factory contract");
      }
      setIsCreating(true);

      const formatedInterest = BigNumber.from(interest.split("%")[0]);
      console.log(name);
      console.log(symbol);
      console.log(formatedInterest.mul(BigNumber.from("100")).toString());

      const result = await factory.createNewToken(
        name,
        symbol,
        description,
        formatedInterest.mul(BigNumber.from("100")).toString()
      );

      console.log(result);
      await result.wait();
      toast.success("Successfully created a new token");
      setIsCreating(false);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
      setIsCreating(false);
    }
  };

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
          <Heading mb={"4"}>Create</Heading>
        </HStack>
        <Box h={"2"} />
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <Text ml={2} mb={1} fontSize={"sm"}>
              Name
            </Text>
            <Input
              backgroundColor={"white"}
              mb={4}
              onChange={(event) => {
                setName(event.target.value);
              }}
            ></Input>
            <Text ml={2} mb={1} fontSize={"sm"}>
              Symbol
            </Text>
            <Input
              backgroundColor={"white"}
              mb={4}
              onChange={(event) => {
                setSymbol(event.target.value);
              }}
            ></Input>
            <Text ml={2} mb={1} fontSize={"sm"}>
              Description
            </Text>
            <Textarea
              backgroundColor={"white"}
              mb={4}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            ></Textarea>
            <Text ml={2} mb={1} fontSize={"sm"}>
              Interest
            </Text>
            <Select
              backgroundColor={"white"}
              mb={6}
              onChange={(event) => {
                setInterest(event.target.value);
              }}
            >
              <option> </option>
              <option>1%</option>
              <option>2%</option>
              <option>5%</option>
              <option>10%</option>
            </Select>
            <Button
              w={"full"}
              onClick={handleCreateToken}
              isLoading={isCreating}
            >
              Create
            </Button>
          </GridItem>
          <GridItem ml={"80px"}>
            <HStack spacing={"30px"}>
              <Flex
                justify={"center"}
                align={"center"}
                rounded={"full"}
                width={"50px"}
                height={"50px"}
                bg={"transparent"}
                textAlign={"center"}
                border={"1px"}
                borderColor={"gray.500"}
              >
                <Text fontSize={"xl"} mb={"4px"}>
                  1
                </Text>
              </Flex>
              <Text>Provide valid data</Text>
            </HStack>
            <Divider
              orientation="vertical"
              ml={"25px"}
              mt={"10px"}
              mb={"10px"}
              height={"90px"}
              borderColor={"gray.500"}
            />
            <HStack spacing={"30px"}>
              <Flex
                justify={"center"}
                align={"center"}
                rounded={"full"}
                width={"50px"}
                height={"50px"}
                bg={"transparent"}
                textAlign={"center"}
                border={"1px"}
                borderColor={"gray.500"}
              >
                <Text fontSize={"xl"} mb={"4px"}>
                  2
                </Text>
              </Flex>
              <Text>Sign the transaction</Text>
            </HStack>
            <Divider
              orientation="vertical"
              ml={"25px"}
              mt={"10px"}
              mb={"10px"}
              height={"90px"}
              borderColor={"gray.500"}
            />{" "}
            <HStack spacing={"30px"}>
              <Flex
                justify={"center"}
                align={"center"}
                rounded={"full"}
                width={"50px"}
                height={"50px"}
                bg={"transparent"}
                textAlign={"center"}
                border={"1px"}
                borderColor={"gray.500"}
              >
                <Text fontSize={"xl"} mb={"4px"}>
                  3
                </Text>
              </Flex>
              <Text>Use your freshly created token!</Text>
            </HStack>
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};
