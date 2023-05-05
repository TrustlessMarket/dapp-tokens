/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import {
  FaDiscord,
  FaInstagram,
  FaMedium,
  FaTelegram,
  FaTwitter,
  FaUser,
} from 'react-icons/fa';
import { StyledSocial } from './Social.styled';

interface SocialTokenProps {
  socials?: any;
}

const SocialToken: React.FC<SocialTokenProps> = ({ socials }) => {
  return (
    <StyledSocial columns={3} gap={2}>
      {socials?.twitter && (
        <Flex
          onClick={() => window.open(socials?.twitter, '_blank')}
          className="item-social"
        >
          <FaTwitter fontSize={'16px'} />
          <Text>Twitter</Text>
        </Flex>
      )}
      {socials?.discord && (
        <Flex
          onClick={() => window.open(socials?.discord, '_blank')}
          className="item-social"
        >
          <FaDiscord />
          <Text>Discord</Text>
        </Flex>
      )}
      {socials?.telegram && (
        <Flex
          onClick={() => window.open(socials?.telegram, '_blank')}
          className="item-social"
        >
          <FaTelegram />
          <Text>Telegram</Text>
        </Flex>
      )}
      {socials?.medium && (
        <Flex
          onClick={() => window.open(socials?.medium, '_blank')}
          className="item-social"
        >
          <FaMedium />
          <Text>Medium</Text>
        </Flex>
      )}
      {socials?.website && (
        <Flex
          onClick={() => window.open(socials?.website, '_blank')}
          className="item-social"
        >
          <FaUser fontSize={'14px'} />
          <Text>Website</Text>
        </Flex>
      )}
      {socials?.instagram && (
        <Flex
          onClick={() => window.open(socials?.instagram, '_blank')}
          className="item-social"
        >
          <FaInstagram />
          <Text>Instagram</Text>
        </Flex>
      )}
    </StyledSocial>
  );
};

export default SocialToken;
