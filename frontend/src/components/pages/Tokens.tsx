import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Link,
  Select,
  Spacer,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TokenDetails, useTokens } from "../../stores/useTokens";
import faker from "@faker-js/faker";
import { BigNumber, ethers } from "ethers";
import { truncateAddress } from "../../helpers/truncateAddress";
import { useNavigate } from "react-router-dom";
import { TESTNET_PREFIX } from "../../constants/explorer";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { FaDonate } from "react-icons/fa";
import Modal from "react-modal";
import { mintModalStyle } from "../../modals/mintModalStyle";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { toast } from "react-toastify";

interface SwapProps {}

// const tokens: TokenDetails[] = [...Array(6).fill(0)].map(() => ({
//   address: faker.finance.ethereumAddress(),
//   symbol: faker.finance.currencySymbol(),
//   name: faker.finance.currencyName(),
//   liquidity: ethers.utils.parseEther(faker.finance.amount(3, 1000)),
//   interest: faker.random.arrayElement([1, 2, 5, 10]),
// }));

export const Swap: React.FC<SwapProps> = () => {
  let navigate = useNavigate();
  const focusedToken = useTokens((state) => state.focusedToken);
  const focusedTokenContract = useTokens((state) => state.focusedTokenContract);
  const focusToken = useTokens((state) => state.focusToken);
  const deFocusToken = useTokens((state) => state.deFocusToken);
  const tokens = useTokens((state) => state.tokens);
  const [isMintModalOpen, setIsMintModalOpen] = useState<boolean>(false);

  const [nameFilter, setNameFilter] = useState<string>("");
  const [addressFilter, setAddressFilter] = useState<string>("");
  const [interestFilter, setInterestFilter] = useState<number>(0);

  const [mintValue, setMintValue] = useState<string>("");
  const [isMintLoading, setMintLoading] = useState<boolean>(false);

  const fetchLiquidityDetails = useTokens(
    (state) => state.fetchLiquidityDetilas
  );
  const focusedTokenLiquidity = useTokens(
    (state) => state.focusedTokenLiquidity
  );

  useEffect(() => {
    useTokens.getState().fetchTokens();
  }, []);

  useEffect(() => {
    if (!focusedTokenContract) return;

    fetchLiquidityDetails();
  }, [focusedTokenContract, fetchLiquidityDetails]);

  const handleTokenClick = (token: TokenDetails) => {
    focusToken(token);
  };

  const handleOpenMintModal = (token: TokenDetails) => {
    setIsMintModalOpen(true);
  };

  const handleMint = async () => {
    setMintLoading(true);
    try {
      if (!focusedTokenContract) {
        throw new Error("Token contract failed to initialize");
      }

      const formattedValue = parseFloat(mintValue.replace(",", "."));
      if (!formattedValue) {
        throw new Error("Failed to validate provided data");
      }

      const result = await focusedTokenContract.mint({
        value: ethers.utils.parseEther(formattedValue.toString()),
      });

      console.log(result);
      setMintLoading(false);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
      setMintLoading(false);
    }
  };
  const handleWithdrawToken = async () => {
    try {
      if (!focusedTokenContract) {
        throw new Error("Token contract failed to initialize");
      }

      const result = await focusedTokenContract.withdraw();

      console.log(result);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
        return console.log(error);
      }

      console.log(error);
    }
  };
  const handleCollectReward = async () => {
    try {
      if (!focusedTokenContract) {
        throw new Error("Token contract failed to initialize");
      }

      const result = await focusedTokenContract.claimReward();

      console.log(result);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
        return console.log(error);
      }

      console.log(error);
    }
  };

  return (
    <Container w={"full"} centerContent>
      <Modal
        isOpen={isMintModalOpen}
        onRequestClose={() => setIsMintModalOpen(false)}
        style={mintModalStyle}
        contentLabel="Example Modal"
      >
        <Heading
          fontWeight={"semibold"}
          fontSize={"3xl"}
          textColor={"gray.600"}
          mb={"20px"}
        >
          Mint tokens
        </Heading>
        <VStack spacing={"10px"} align={"start"}>
          <Text>Locked value</Text>
          <Flex w={"full"}>
            <Input
              flex={"1"}
              mr={"10px"}
              onChange={(event) => setMintValue(event.target.value)}
            ></Input>
            <Button
              width={"150px"}
              p={"15px"}
              onClick={() => handleMint()}
              isLoading={isMintLoading}
            >
              Mint
            </Button>
          </Flex>
        </VStack>

        <Text mt={"20px"} px={"10px"} color={"gray.500"}>
          <AiOutlineInfoCircle />
          <Text mt={"5px"}>
            After this transaction you will receive equivalent amount of tokens
            for your locked liquidity ammount.
          </Text>
        </Text>
      </Modal>
      <Box h={"10"} />
      <Box w={"container.xl"}>
        <Flex>
          <Heading mb={"4"}>Tokens</Heading>
          <Spacer />
          <HStack spacing={"10px"}>
            <Button
              onClick={() => {
                navigate("/create");
              }}
            >
              + Create token
            </Button>
            <Button
              onClick={() => {
                navigate("/positions");
              }}
            >
              Your positions
            </Button>
          </HStack>
        </Flex>
        <Box h={"2"} />
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem
            w="100%"
            minH="100"
            bg="gray.100"
            rounded="md"
            p={4}
            alignSelf={"flex-start"}
          >
            <Heading size={"sm"} color={"gray.600"} mb={"4"}>
              Search
            </Heading>
            <Text ml={2} mb={1} fontSize={"sm"}>
              Token name
            </Text>
            <Input
              backgroundColor={"white"}
              mb={4}
              onChange={(event) => setNameFilter(event.target.value)}
            ></Input>
            <Text ml={2} mb={1} fontSize={"sm"}>
              Token address
            </Text>
            <Input
              backgroundColor={"white"}
              mb={4}
              onChange={(event) => setAddressFilter(event.target.value)}
            ></Input>
            <Text ml={2} mb={1} fontSize={"sm"}>
              Interest
            </Text>
            <Select backgroundColor={"white"} mb={4}>
              <option> </option>
              <option>1%</option>
              <option>2%</option>
              <option>5%</option>
              <option>10%</option>
            </Select>
          </GridItem>
          <GridItem colSpan={2}>
            {focusedToken ? (
              <Box>
                <HStack spacing={"15px"} fontSize={"2xl"}>
                  <Button variant={"solid"} onClick={() => deFocusToken()}>
                    <AiOutlineArrowLeft></AiOutlineArrowLeft>
                  </Button>
                  <Text fontWeight={"semibold"}>{focusedToken.name}</Text>
                  <Text textColor={"gray.500"} fontSize={"xl"}>
                    {focusedToken.symbol}
                  </Text>
                </HStack>
                <Divider mb={"10px"} mt={"30px"} />
                <Text fontSize={"xl"} fontWeight={"semibold"} mb={"10px"}>
                  Token details
                </Text>
                <Stack spacing={"10px"} px={"15px"}>
                  <HStack>
                    <Text color={"gray.300"}>locked liquidity: </Text>
                    <Text fontSize={"lg"}>
                      {focusedTokenLiquidity
                        ? ethers.utils.formatEther(
                            focusedTokenLiquidity.lockedLiquidity
                          )
                        : "-"}{" "}
                      TFuel
                    </Text>
                  </HStack>
                  <HStack>
                    <Text color={"gray.300"}>address: </Text>
                    <Text fontSize={"lg"}>{focusedToken.address}</Text>
                  </HStack>
                  <Stack>
                    <Text color={"gray.300"}>description: </Text>
                    <Text fontSize={"lg"} px={"20px"}>
                      {focusedToken.description}
                    </Text>
                  </Stack>
                  <HStack>
                    <Text color={"gray.300"}>interest: </Text>
                    <Text fontSize={"lg"}>{focusedToken.interest}%</Text>
                  </HStack>
                </Stack>
                <Divider mb={"10px"} mt={"30px"} />
                <Text fontSize={"xl"} fontWeight={"semibold"} mb={"10px"}>
                  Actions
                </Text>
                <Stack px={"15px"} mb={"15px"}></Stack>
                <Stack
                  spacing={"20px"}
                  justifyContent={"flex-start"}
                  align={"start"}
                >
                  <Button
                    p={"25px"}
                    onClick={() => handleOpenMintModal(focusedToken)}
                    disabled={focusedTokenLiquidity?.userLockedLiquidity.gt(
                      BigNumber.from("0")
                    )}
                  >
                    Mint <GiPayMoney className="ml-4" />
                  </Button>
                  <HStack spacing={"20px"}>
                    <Button p={"25px"} onClick={() => handleWithdrawToken()}>
                      Withdraw <GiReceiveMoney className="ml-4" />
                    </Button>
                    <HStack>
                      <Text color={"gray.300"}>your locked liquidity: </Text>
                      <Text fontSize={"lg"}>
                        {focusedTokenLiquidity
                          ? ethers.utils.formatEther(
                              focusedTokenLiquidity.userLockedLiquidity
                            )
                          : "-"}{" "}
                        TFuel
                      </Text>
                    </HStack>
                  </HStack>
                  <HStack spacing={"20px"}>
                    <Button p={"25px"} onClick={() => handleCollectReward()}>
                      Collect rewards
                      <FaDonate className="ml-4" />
                    </Button>
                    <HStack>
                      <Text color={"gray.300"}>your generated rewards: </Text>
                      <Text fontSize={"lg"}>
                        {" "}
                        {focusedTokenLiquidity
                          ? ethers.utils.formatEther(
                              focusedTokenLiquidity.generatedRewards
                            )
                          : "-"}{" "}
                        {focusedToken.symbol}
                      </Text>
                    </HStack>
                  </HStack>
                </Stack>
              </Box>
            ) : (
              <TableContainer>
                <Table variant="simple" size={"lg"}>
                  <TableCaption textColor={"gray.300"}>
                    Tokens created using Fluido
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Token</Th>
                      <Th>TVL</Th>
                      <Th>Address</Th>
                      <Th>Interest rate</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tokens &&
                      tokens
                        .filter((token) =>
                          nameFilter
                            ? token.name.substring(0, nameFilter.length) ===
                              nameFilter
                            : true
                        )
                        .filter((token) =>
                          addressFilter
                            ? token.address.substring(
                                0,
                                addressFilter.length
                              ) === addressFilter
                            : true
                        )
                        .map((token) => (
                          <Tr
                            key={token.address}
                            cursor={"pointer"}
                            onClick={() => {
                              handleTokenClick(token);
                            }}
                            className={
                              "hover:bg-gray-100 transition-all duration-300"
                            }
                          >
                            <Td>
                              <HStack>
                                <Text>{token.name}</Text>
                                <Text textColor={"gray.500"}>
                                  {token.symbol}
                                </Text>
                              </HStack>
                            </Td>
                            <Td>{`${ethers.utils.formatEther(
                              token.liquidity
                            )} TFuel`}</Td>
                            <Td>
                              <Link
                                href={
                                  TESTNET_PREFIX + "/account/" + token.address
                                }
                              >
                                {truncateAddress(token.address, 20)}
                              </Link>
                            </Td>
                            <Td isNumeric>{`${token.interest}%`}</Td>
                          </Tr>
                        ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};
