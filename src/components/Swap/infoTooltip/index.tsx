/* eslint-disable @typescript-eslint/no-explicit-any */
import { colors } from '@/theme/colors';
import { Flex, Icon, PlacementWithLogical, Tooltip } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { MdHelpOutline } from 'react-icons/md';

interface InfoTooltipProps {
  label: ReactNode;
  children?: ReactNode;
  placement?: PlacementWithLogical;
  iconSize?: string;
  fontSize?: string;
  iconColor?: string;
  showIcon?: boolean;
  iconName?: any;
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
    iconName = MdHelpOutline,
  } = props;

  const renderChild = () => {
    if (children && showIcon) {
      return (
        <Flex gap={1} alignItems={'center'}>
          {children}
          <Icon as={iconName} fontSize={iconSize} color={iconColor} />
        </Flex>
      );
    }
    if (children) {
      return children;
    }
    return <Icon as={iconName} fontSize={iconSize} color={colors.white} />;
  };

  return (
    <Tooltip
      fontSize={fontSize}
      placement={placement}
      closeOnClick={false}
      label={label}
      className="popup-tooltip"
    >
      {renderChild()}
    </Tooltip>
  );
};

export default InfoTooltip;
