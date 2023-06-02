/* eslint-disable @typescript-eslint/no-explicit-any */
import { colors } from '@/theme/colors';
import { Flex, Icon, PlacementWithLogical, Tooltip } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { MdInfoOutline } from 'react-icons/md';

interface InfoTooltipProps {
  label: ReactNode;
  children?: ReactNode;
  placement?: PlacementWithLogical;
  iconSize?: string;
  fontSize?: string;
  iconColor?: string;
  showIcon?: boolean;
}

const InfoTooltip = (props: InfoTooltipProps) => {
  const {
    label,
    fontSize,
    iconSize = 'md',
    placement = 'top',
    children,
    showIcon = false,
    iconColor = colors.white,
  } = props;

  const renderChild = () => {
    if (children && showIcon) {
      return (
        <Flex gap={1} alignItems={'center'}>
          {children}
          <Icon fontSize={iconSize} as={MdInfoOutline} color={iconColor} />
        </Flex>
      );
    }
    if (children) {
      return children;
    }
    return <Icon fontSize={iconSize} as={MdInfoOutline} color={colors.white} />;
  };

  return (
    <Tooltip
      fontSize={fontSize}
      placement={placement}
      closeOnClick={false}
      label={label}
    >
      {renderChild()}
    </Tooltip>
  );
};

export default InfoTooltip;
