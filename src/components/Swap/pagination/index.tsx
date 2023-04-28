/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Flex, IconButton, Icon, Text } from '@chakra-ui/react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChangePage: Function;
  flexConfig?: any;
}

const Pagination = (props: PaginationProps) => {
  const { page, pageSize, total, onChangePage, flexConfig } = props;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <Flex alignItems="center" gap={4} {...flexConfig}>
      <Text>
        Showing {start} - {end} of {total}
      </Text>
      <IconButton
        size={'sm'}
        borderColor={'#000'}
        borderWidth={1}
        colorScheme="whiteAlpha"
        isRound
        variant="outline"
        onClick={() => onChangePage(page - 1)}
        disabled={page <= 1}
        aria-label="prev"
        icon={<Icon as={MdChevronLeft} />}
      />
      <IconButton
        size={'sm'}
        borderColor={'#000'}
        borderWidth={1}
        colorScheme="whiteAlpha"
        isRound
        variant="outline"
        onClick={() => onChangePage(page + 1)}
        disabled={page * pageSize >= total}
        aria-label="next"
        icon={<Icon as={MdChevronRight} />}
      />
    </Flex>
  );
};

export default Pagination;
