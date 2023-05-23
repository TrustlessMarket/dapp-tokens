/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState} from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Text
} from '@chakra-ui/react'
import styles from './styles.module.scss'
import IconPlusToMinus from "@/components/Swap/iconPlusToMinus";
import cx from 'classnames';

const Item = ({ data } : {data: any}) => {
  const [open, setOpen] = useState(false)

  return (
    <Accordion allowToggle onChange={i => setOpen(i === 0)}>
      <AccordionItem border='none' borderRadius={12} w={['100%', '760px']} bgColor='#1E1E22'>
        <AccordionButton px={[6,6]} pt={6} pb={open ? 4 : 6}>
          <Flex w='100%' alignItems='center'>
            <IconPlusToMinus open={open} size='16px' color='text.accent' />
            <Text ml={6} fontSize='lg' fontWeight='medium' textAlign={"left"} className={cx('faq-question')}>{data.q}</Text>
          </Flex>
        </AccordionButton>
        <AccordionPanel pl={16} pr={6} pb={6} style={{paddingTop: '0'}}>
          <Box className={cx(styles.answer, 'faq-answer')} color='text.secondary' fontSize='sm' dangerouslySetInnerHTML={{ __html: data.a }} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

const Section = ({title, data}: {title?: any, data: any}) => {
  const [viewAll, setViewAll] = useState(false);

  const renderData = viewAll ? data : [data[0], data[1], data[2], data[3], data[4]];

  return (
      <Flex direction='column'>
        {title && <Text fontSize='lg' fontWeight='medium' textAlign={"left"}>{title}</Text>}
        <Flex gap={2} direction='column' mt={4}>
          {renderData.map((e: any , i: number ) => <Item key={i} data={e} />)}
        </Flex>
        <Button color={"#FFFFFF"} mt={4} fontSize='md' fontWeight='medium' variant={"outline"} borderRadius={"8px"} h={"56px"} onClick={() => setViewAll(!viewAll)}>{viewAll ? 'View Less' : 'View All'}</Button>
      </Flex>
  )
}

const FAQs = ({data, desc} : {data: any, desc?: any}) => {
  return (
    <Flex direction='column' alignItems='center'>
      <Heading><Flex alignItems={"center"} gap={4}>FAQs</Flex></Heading>
      <Text my={desc ? 8 : 5} maxW='800px' textAlign={['left', 'center']} color='#FFFFFF'>{desc}</Text>
      <Section data={data}/>
    </Flex>
  )
}

export default FAQs;