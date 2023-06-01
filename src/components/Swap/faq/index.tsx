/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState} from 'react'
import {Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Flex, Text} from '@chakra-ui/react'
import styles from './styles.module.scss'
import IconPlusToMinus from "@/components/Swap/iconPlusToMinus";
import cx from 'classnames';
import Empty from "@/components/Empty";

const Item = ({ data } : {data: any}) => {
  const [open, setOpen] = useState(false)

  return (
    <Accordion allowToggle onChange={i => setOpen(i === 0)}>
      <AccordionItem border='none' borderRadius={12} w={['100%', '100%']} bgColor='#1E1E22'>
        <AccordionButton px={[6,6]} pt={6} pb={open ? 4 : 6}>
          <Flex w='100%' alignItems='center'>
            <IconPlusToMinus open={open} size='16px' color='#1b77fd' />
            <Text ml={6} fontSize='lg' fontWeight='medium' textAlign={"left"} className={cx('faq-question')}>{data?.q}</Text>
          </Flex>
        </AccordionButton>
        <AccordionPanel pl={16} pr={6} pb={6} style={{paddingTop: '0'}}>
          <Box className={cx(styles.answer, 'faq-answer')} color='text.secondary' fontSize='sm' dangerouslySetInnerHTML={{ __html: data?.a }} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

const Section = ({title, data}: {title?: any, data: any}) => {
  const [viewAll, setViewAll] = useState(false);

  const renderData = viewAll || data?.length < 5 ? data : [data[0], data[1], data[2], data[3], data[4]];

  return (
      <Flex direction='column' w={"100%"}>
        {title && <Text fontSize='lg' fontWeight='medium' textAlign={"left"}>{title}</Text>}
        <Flex gap={2} direction='column' mt={4}>
          {renderData.map((e: any , i: number ) => <Item key={i} data={e} />)}
        </Flex>
        {
          data?.length > 5 && (
            <Button
              color={"#FFFFFF"} mt={4} fontSize='md' fontWeight='medium'
              variant={"outline"} borderRadius={"8px"} h={"56px"}
              border={"1px solid #1b77fd"}
              _hover={{
                backgroundColor: '#1E1E22',
              }}
              onClick={() => setViewAll(!viewAll)}>{viewAll ? 'View Less' : 'View All'}
            </Button>
          )
        }
      </Flex>
  )
}

const FAQs = ({data} : {data: any, desc?: any}) => {
  return (
    <Flex direction='column' alignItems='center'>
      {/*<Heading><Flex alignItems={"center"} gap={4}>FAQs</Flex></Heading>*/}
      {/*<Text my={desc ? 8 : 5} maxW='800px' textAlign={['left', 'center']} color='#FFFFFF'>{desc}</Text>*/}
      {
        data?.length > 0 ? (
          <Section data={data}/>
        ) : (
          <Empty isTable={false} />
        )
      }
    </Flex>
  )
}

export default FAQs;