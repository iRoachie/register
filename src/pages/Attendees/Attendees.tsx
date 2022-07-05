import React, { useState } from 'react';
import {
  Wrapper,
  Loading,
  Section,
  EmptyData,
  AttendeesList,
} from '../../components';
import styled from 'styled-components';
import {
  Form,
  Input,
  Button,
  message,
  Select,
  List,
  Card,
  Badge,
  Popconfirm,
} from 'antd';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../../config';
import {
  FileExcelTwoTone,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useOutletContext, useParams } from 'react-router-dom';
import { usePageTitle } from '../../utils/usePageTitle';
import { AttendeeEdit } from './components/AtttendeeEdit';
import { Attendee, ViewEventContext } from '../../utils/types';

export const Attendees = () => {
  const { eventId } = useParams();
  usePageTitle('Attendees');

  const { attendees, categories, categoriesStatus, attendeesStatus } =
    useOutletContext<ViewEventContext>();

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<{
    id: string;
    updating: boolean;
  } | null>(null);

  const [form] = Form.useForm();

  const onCreateAttendee = async ({
    name,
    category: categoryId,
  }: {
    name: string;
    category: string;
  }) => {
    setLoading(true);

    try {
      if (attendees?.find((a) => a.name.toLowerCase() === name.toLowerCase())) {
        message.error('Attendee already added');
        return;
      }
      const category = categories.find((a) => a.id === categoryId)!;

      const attendee = {
        name,
        category,
        present: false,
        createdAt: Date.now(),
      };

      await addDoc(
        collection(firestore, `events/${eventId}/attendees`),
        attendee
      );

      message.success(`Attendee "${name}" in "${category.name}" added.`, 3);
      form.resetFields();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateSearch = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const input = value.trim();
    setSearch(input);
  };

  const onToggleAttendeeSelected = (attendeeId: string) => {
    if (selectedAttendee?.id === attendeeId) {
      setSelectedAttendee(null);
      return;
    }

    setSelectedAttendee({ id: attendeeId, updating: false });
  };

  const onUpdateAttendee = async (attendee: Attendee) => {
    setSelectedAttendee({ id: attendee.id, updating: true });

    try {
      await updateDoc(
        doc(firestore, `events/${eventId}/attendees/${attendee.id}`),
        attendee as any
      );

      message.success(`Attendee "${attendee.name}" updated.`, 3);

      onToggleAttendeeSelected(attendee.id);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteAttendee = async ({ id, name, category }: Attendee) => {
    setSelectedAttendee({ id, updating: true });

    try {
      await deleteDoc(doc(firestore, `/events/${eventId}/attendees/${id}`));

      const categoryName = category ? category.name : 'No Category';

      message.success(`Attendee "${name}" from "${categoryName}" deleted.`, 3);

      setSelectedAttendee(null);
    } catch (error) {
      console.error(error);
    }
  };

  const onExcelExport = () => {
    window.open(`${import.meta.env.VITE_EXPORT_EXCEL_API}/?eventId=${eventId}`);
  };

  if (attendeesStatus !== 'success' && categoriesStatus !== 'success') {
    return <Loading />;
  }

  const filteredAttendees =
    search === ''
      ? attendees
      : attendees.filter((a) =>
          a.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <Container>
      <Wrapper>
        <Section
          title="New Attendee"
          description="Add a new attendee for this event."
        >
          <Form form={form} onFinish={onCreateAttendee}>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Please input attendee name!' },
              ]}
            >
              <Input
                type="text"
                disabled={loading}
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Attendee Name"
              />
            </Form.Item>

            <Form.Item
              name="category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select disabled={loading} placeholder="Category">
                {categories.map((a) => (
                  <Select.Option value={a.id} key={a.id}>
                    {a.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Button htmlType="submit" type="primary" loading={loading}>
              Add Attendee
            </Button>
          </Form>
        </Section>

        <Section
          title={
            <h3>
              Attendees <Badge count={attendees.length} overflowCount={9999} />
            </h3>
          }
          description="List of all attendees invited to this event."
          content={
            <Button type="dashed" onClick={onExcelExport}>
              <FileExcelTwoTone />
              Export To Excel
            </Button>
          }
        >
          {attendees.length === 0 ? (
            <EmptyData
              title="No Attendees Added as Yet"
              description="Fortunately, it’s very easy to create one."
            />
          ) : (
            <Card>
              <Search
                placeholder="Search attendees"
                prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                value={search}
                onChange={onUpdateSearch}
              />

              <AttendeesList>
                <List
                  dataSource={filteredAttendees}
                  renderItem={(attendee: Attendee) =>
                    selectedAttendee?.id === attendee.id ? (
                      <AttendeeEdit
                        attendee={attendee}
                        categories={categories}
                        cancelEditing={() =>
                          onToggleAttendeeSelected(attendee.id)
                        }
                        updating={selectedAttendee.updating}
                        updateAttendee={onUpdateAttendee}
                      />
                    ) : (
                      <List.Item
                        actions={[
                          <Button
                            key="edit"
                            type="dashed"
                            onClick={() =>
                              onToggleAttendeeSelected(attendee.id)
                            }
                          >
                            Edit
                          </Button>,
                          <Popconfirm
                            key="delete"
                            title="Are you sure want to delete this attendee?"
                            onConfirm={() => onDeleteAttendee(attendee)}
                            okText="Yes"
                            cancelText="No"
                            okType="danger"
                          >
                            <Button danger>Delete</Button>
                          </Popconfirm>,
                        ]}
                      >
                        <List.Item.Meta
                          title={attendee.name}
                          description={
                            attendee.category
                              ? attendee.category.name
                              : 'No Category'
                          }
                        />
                      </List.Item>
                    )
                  }
                />
              </AttendeesList>
            </Card>
          )}
        </Section>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 30px;
`;

const Search = styled(Input)`
  margin-bottom: 20px;
`;
