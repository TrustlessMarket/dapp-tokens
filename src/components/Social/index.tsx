/* eslint-disable @typescript-eslint/no-explicit-any */
import {Flex} from '@chakra-ui/react';
import React from 'react';
import {FaDiscord, FaInstagram, FaMedium, FaTelegram, FaTwitter,} from 'react-icons/fa';
import {RiEarthFill} from 'react-icons/ri';
import {StyledSocial} from './Social.styled';
import {colors} from '@/theme/colors';

interface SocialTokenProps {
  socials?: any;
  theme?: 'light' | 'dark';
  isShowEmpty?: boolean;
}

const SocialToken: React.FC<SocialTokenProps> = ({
  socials,
  theme,
  isShowEmpty = false,
}) => {
  const color = theme === 'light' ? colors.dark : colors.white;
  return (
    <StyledSocial
      className={'social-container'}
      gap={4}
      style={{ height: isShowEmpty ? '100%' : 'auto' }}
    >
      {socials?.twitter && (
        <Flex
          onClick={() => window.open(socials?.twitter, '_blank')}
          className="item-social"
        >
          <FaTwitter fontSize={'20px'} style={{ color }} />
        </Flex>
      )}
      {socials?.discord && (
        <Flex
          onClick={() => window.open(socials?.discord, '_blank')}
          className="item-social"
        >
          <FaDiscord fontSize={'20px'} style={{ color }} />
        </Flex>
      )}
      {socials?.telegram && (
        <Flex
          onClick={() => window.open(socials?.telegram, '_blank')}
          className="item-social"
        >
          <FaTelegram fontSize={'20px'} style={{ color }} />
        </Flex>
      )}
      {socials?.medium && (
        <Flex
          onClick={() => window.open(socials?.medium, '_blank')}
          className="item-social"
        >
          <FaMedium fontSize={'20px'} style={{ color }} />
        </Flex>
      )}
      {socials?.website && (
        <Flex
          onClick={() => window.open(socials?.website, '_blank')}
          className="item-social"
        >
          <RiEarthFill fontSize={'20px'} style={{ color }} />
        </Flex>
      )}
      {socials?.instagram && (
        <Flex
          onClick={() => window.open(socials?.instagram, '_blank')}
          className="item-social"
        >
          <FaInstagram fontSize={'20px'} style={{ color }} />
        </Flex>
      )}
    </StyledSocial>
  );
};

export default SocialToken;
