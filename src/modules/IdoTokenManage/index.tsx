import React, { useEffect } from 'react';
import { StyledIdoManage } from './IdoTokenManage.styled';
import { useRouter } from 'next/router';
import { Form } from 'react-final-form';
import IdoTokenManageForm from './IdoTokenManage.Form';
import { Text } from '@chakra-ui/react';

const IdoTokenManage = () => {
  const router = useRouter();

  const id = router?.query?.id;

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    if (!id) {
      return;
    }

    try {
      // const response: any;
    } catch (error) {}
  };

  const onSubmit = async () => {
    try {
    } catch (error) {}
  };

  return (
    <StyledIdoManage>
      <Text className="title" as={'h2'}>
        {id ? 'Update IDO Token' : 'Create IDO Token'}
      </Text>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => <IdoTokenManageForm handleSubmit={handleSubmit} />}
      </Form>
    </StyledIdoManage>
  );
};

export default IdoTokenManage;
