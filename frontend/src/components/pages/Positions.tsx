import {
  Container,
  Box,
  Heading,
  Grid,
  Button,
  HStack,
  GridItem,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Link,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { TESTNET_PREFIX } from "../../constants/explorer";
import { truncateAddress } from "../../helpers/truncateAddress";
import { useTokens } from "../../stores/useTokens";

interface PositionsProps {}

export const Positions: React.FC<PositionsProps> = () => {
  let navigate = useNavigate();
  const fetchUserTokens = useTokens((state) => state.fetchUserTokens);
  const userTokens = useTokens((state) => state.userTokens);

  useEffect(() => {
    fetchUserTokens();
  }, [fetchUserTokens]);

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
        <Box h={"10"} />
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={2}>
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
                  {userTokens &&
                    userTokens.map((token) => (
                      <Tr
                        key={token.address}
                        className={
                          "hover:bg-gray-100 transition-all duration-300"
                        }
                      >
                        <Td>
                          <HStack>
                            <Text>{token.name}</Text>
                            <Text textColor={"gray.500"}>{token.symbol}</Text>
                          </HStack>
                        </Td>
                        <Td>{`${ethers.utils.formatEther(
                          token.liquidity
                        )} TFuel`}</Td>
                        <Td>
                          <Link
                            href={TESTNET_PREFIX + "/account/" + token.address}
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
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};
