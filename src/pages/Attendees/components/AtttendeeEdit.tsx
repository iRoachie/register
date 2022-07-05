import React, { useEffect } from 'react';
import { Form, List, Input, Select, Button } from 'antd';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';
import { Attendee, Category } from '../../../utils/types';

interface Props {
  attendee: Attendee;
  categories: Category[];
  updating: boolean;
  cancelEditing(attendeeId: string): void;
  updateAttendee(attendee: Attendee): void;
}

export const AttendeeEdit = ({
  attendee,
  updating,
  categories,
  cancelEditing,
  updateAttendee,
}: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFields([
      {
        name: 'name',
        value: attendee.name,
      },
      {
        name: 'category',
        value: attendee.category?.id,
      },
    ]);
  }, [attendee, form]);

  const onSubmit = (values: { name: string; category: string }) => {
    const category = categories.find((a) => a.id === values.category);

    updateAttendee({ ...attendee, category, name: values.name });
  };

  return (
    <List.Item>
      <Container>
        <Title>Editing: {attendee.name}</Title>

        <Form form={form} onFinish={onSubmit} layout="vertical">
          <Inputs>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input attendee name!',
                },
              ]}
            >
              <Input
                type="text"
                disabled={updating}
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Attendee name"
              />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[
                {
                  required: true,
                  message: 'Please input attendee name!',
                },
              ]}
            >
              <Select placeholder="Category">
                {categories.map((a) => (
                  <Select.Option value={a.id} key={a.id}>
                    {a.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Inputs>

          <Buttons>
            <Button
              htmlType="button"
              onClick={() => cancelEditing(attendee.id)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={updating}>
              Update
            </Button>
          </Buttons>
        </Form>
      </Container>
    </List.Item>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Title = styled.p`
  font-weight: bold;
`;

const Inputs = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 16px;

  .ant-form-item {
    margin-right: 8px;
    flex: 1;
    margin-bottom: 0;
  }
`;

const Buttons = styled.footer`
  button {
    margin-right: 8px;
  }
`;
