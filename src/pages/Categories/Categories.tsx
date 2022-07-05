import React, { useState } from 'react';
import { Wrapper, Loading, Section, EmptyData } from '../../components';
import { firestore } from '../../config';
import styled from 'styled-components';
import {
  Form,
  Input,
  Button,
  message,
  Tag,
  Popconfirm,
  notification,
} from 'antd';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { TagOutlined } from '@ant-design/icons';
import { useOutletContext, useParams } from 'react-router-dom';
import { usePageTitle } from '../../utils/usePageTitle';
import { Category, ViewEventContext } from '../../utils/types';

export const Categories = () => {
  const { eventId } = useParams();
  usePageTitle('Categories');
  const [form] = Form.useForm();

  const { categories, categoriesStatus } = useOutletContext<ViewEventContext>();
  const [loading, setLoading] = useState(false);

  const onCreateCategory = async ({ category }: { category: string }) => {
    setLoading(true);

    try {
      if (
        categories?.find((a) => a.name.toLowerCase() === category.toLowerCase())
      ) {
        message.error('Category already added');
        return;
      }

      await addDoc(collection(firestore, `events/${eventId}/categories`), {
        name: category,
        createdAt: Date.now(),
      });

      message.success(`Category "${category}" created.`, 3);

      form.setFields([{ name: 'category', value: '' }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteCategory = async ({ id, name }: Category) => {
    try {
      await deleteDoc(doc(firestore, `events/${eventId}/categories/${id}`));

      notification.success({
        message: `Category "${name}" deleted.`,
        description:
          'All attendees previously assigned this category will be unassigned shortly.',
        duration: 7,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (categoriesStatus === 'loading') {
    return <Loading />;
  }

  return (
    <Container>
      <Wrapper>
        <Section
          title="New Category"
          description="Add a new category to group attendees by."
        >
          <CategoryForm form={form} onFinish={onCreateCategory} layout="inline">
            <Form.Item
              name="category"
              rules={[
                {
                  required: true,
                  message: 'Please input category name!',
                },
              ]}
            >
              <Input
                type="text"
                disabled={loading}
                prefix={<TagOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Category"
              />
            </Form.Item>

            <Button htmlType="submit" type="primary" loading={loading}>
              Add Category
            </Button>
          </CategoryForm>
        </Section>

        <Section
          title="Categories"
          description="List of all categories for this event."
        >
          {categories.length === 0 ? (
            <EmptyData
              title="No Categories Added as Yet"
              description="Fortunately, it’s very easy to create one."
            />
          ) : (
            categories.map((a) => (
              <Popconfirm
                key={a.id}
                title="Are you sure want to delete this category?"
                onConfirm={() => onDeleteCategory(a)}
                okText="Yes"
                cancelText="No"
                okType="danger"
              >
                <CategoryTag>{a.name}</CategoryTag>
              </Popconfirm>
            ))
          )}
        </Section>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 30px;
`;

const CategoryForm = styled(Form)`
  display: flex;
  align-items: flex-start;
` as typeof Form;

const CategoryTag = styled(Tag)`
  font-size: 14px;
  padding: 3px 7px;
  height: unset;
  margin-bottom: 0.5rem;
`;
