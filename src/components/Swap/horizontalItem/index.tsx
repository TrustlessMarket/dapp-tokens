/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import React, { memo } from 'react';
import { MdHelpOutline } from 'react-icons/md';
import styles from './styles.module.scss';

interface HorizonalItemProps {
  label?: any;
  desc?: any;
  value?: any | React.ReactElement;
  color?: any;
}

const HorizontalItem: React.FC<HorizonalItemProps> = ({
  label,
  value,
  desc,
  color,
}) => {
  return (
    <Flex
      className={styles.container}
      alignItems={'flex-end'}
      justifyContent={'space-between'}
      color={color}
      gap={1}
    >
      <Flex alignItems={'center'} gap={1}>
        {label}
        {desc && (
          <Tooltip hasArrow label={desc} className="popup-tooltip">
            <Flex>
              <MdHelpOutline color={'inherit'} />
            </Flex>
          </Tooltip>
        )}
      </Flex>

      <Box>{value}</Box>
    </Flex>
  );
};

export default memo(HorizontalItem);
