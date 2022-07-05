import React, { useState } from 'react';
import { Card, Button, Form, Input, message } from 'antd';
import { firestore } from '../../../config';
import { addDoc, collection } from 'firebase/firestore';

import styled from 'styled-components';
import { CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../../utils/usePageTitle';

export const NewEvent = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  usePageTitle('New Event');

  const onSubmit = async (name: string) => {
    setLoading(true);

    try {
      const event = await addDoc(collection(firestore, 'events'), {
        name,
        createdAt: Date.now(),
      });

      message.success(`Event "${name}" created.`, 3, () => {
        navigate(`/events/${event.id}`);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content>
      <Title>Create New Event</Title>

      <Form form={form} onFinish={onSubmit}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input event name!' }]}
        >
          <Input
            type="text"
            disabled={loading}
            prefix={<CalendarOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Event Name"
          />
        </Form.Item>

        <Button htmlType="submit" type="primary" loading={loading}>
          Create Event
        </Button>
      </Form>
    </Content>
  );
};

const Content = styled(Card)`
  max-width: 500px;
  margin: 30px auto 0;
  text-align: center;

  button {
    width: 100%;
  }
`;

const Title = styled.h3`
  margin-bottom: 30px;
`;
