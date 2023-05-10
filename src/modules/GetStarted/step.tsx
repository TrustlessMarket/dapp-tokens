import {Box, Center, Flex, Text} from "@chakra-ui/react";

interface IStep {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  step?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  desc?: any;
}

const Step = ({data} : {data: IStep}) => {
  return (
    <Flex gap={6} color={"#FFFFFF"} bg={"#1E1E22"} borderRadius={"8px"} p={6} key={data?.step}>
      <Center fontSize={"28px"} fontWeight={"700"} borderRadius={"50%"}
              bg={"#3385FF"}
              w={"50px"} h={"50px"} minW={"50px"} minH={"50px"}
      >
        {data?.step}
      </Center>
      <Flex direction={"column"} alignItems={"flex-start"} textAlign={"left"}>
        <Text fontSize={"28px"} fontWeight={"700"}>{data?.title}</Text>
        <Box fontSize={"md"}>
          {data?.desc}
        </Box>
      </Flex>
    </Flex>
  )
};

export default Step;