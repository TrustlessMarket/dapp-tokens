import { ChakraComponent, Box, BoxProps } from '@chakra-ui/react';

type DivComponent = ChakraComponent<'div', {}>

const Card = ((props: BoxProps) => (
  <Box bgColor='background.card' borderRadius={16} boxShadow='0px 0px 24px 0px #0000000A' {...props} />
)) as DivComponent

export default Card