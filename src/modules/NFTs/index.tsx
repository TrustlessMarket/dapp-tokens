import { Heading, Text } from '@chakra-ui/react';
import { UploadFileContainer } from '../Tokens/Tokens.styled';
import px2rem from '@/utils/px2rem';
import CollectionList from './Collection/List';

const NFTsPage = () => {
  return (
    <div>
      <Heading as="h3" color="white" textAlign={'center'} mt={px2rem(32)}>
        Smart BRC-20
      </Heading>
      <UploadFileContainer className="max-content">
        <div className="upload_left">
          {/* <img src={IcBitcoinCloud} alt="upload file icon" /> */}
          <div className="upload_content">
            {/* <h3 className="upload_title">BRC-20 on Bitcoin</h3> */}
            <Text className="upload_text" color={'rgba(255, 255, 255, 0.7)'}>
              Smart BRC-20s are{' '}
              <span style={{ color: '#FFFFFF' }}>
                the first smart contracts deployed on Bitcoin
              </span>
              . They run exactly as programmed without any possibility of fraud,
              third-party interference, or censorship. Issue your Smart BRC-20 on
              Bitcoin for virtually anything: a cryptocurrency, a share in a company,
              voting rights in a DAO, and more.
            </Text>
          </div>
        </div>
      </UploadFileContainer>
      <CollectionList />
    </div>
  );
};

export default NFTsPage;
