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
  Select,
} from 'antd';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { TagOutlined, FundOutlined, PlusOutlined } from '@ant-design/icons';
import { useOutletContext, useParams } from 'react-router-dom';
import { usePageTitle } from '../../utils/usePageTitle';
import { Category, Total, ViewEventContext } from '../../utils/types';

export const Categories = () => {
  const { eventId } = useParams();
  usePageTitle('Categories');
  const [newCategoryForm] = Form.useForm();
  const [newTotalForm] = Form.useForm();

  const { categories, categoriesStatus, totals, totalsStatus } =
    useOutletContext<ViewEventContext>();
  const [createCategoryLoading, setCreateCategoryLoading] = useState(false);
  const [createTotalLoading, setCreateTotalLoading] = useState(false);

  const onCreateCategory = async ({ category }: { category: string }) => {
    setCreateCategoryLoading(true);

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

      newCategoryForm.setFields([{ name: 'category', value: '' }]);
    } catch (error) {
      console.error(error);
    } finally {
      setCreateCategoryLoading(false);
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

      newTotalForm.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  const onCreateTotal = async ({ name, categories }: Total) => {
    setCreateTotalLoading(true);

    try {
      await addDoc(collection(firestore, `events/${eventId}/totals`), {
        name,
        createdAt: Date.now(),
        categories,
      });

      message.success(`Total "${name}" created.`, 3);

      newTotalForm.resetFields();
    } catch (error) {
      console.error(error);
    } finally {
      setCreateTotalLoading(false);
    }
  };

  const onDeleteTotal = async ({ id, name }: Total) => {
    try {
      await deleteDoc(doc(firestore, `events/${eventId}/totals/${id}`));

      notification.success({
        message: `Total "${name}" deleted.`,
        duration: 3,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (categoriesStatus === 'loading' || totalsStatus === 'loading') {
    return <Loading />;
  }

  return (
    <Container>
      <Wrapper>
        <Section
          title="New Category"
          description="Add a new category to group attendees by."
        >
          <CategoryForm
            form={newCategoryForm}
            onFinish={onCreateCategory}
            layout="inline"
          >
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
                disabled={createCategoryLoading}
                prefix={<TagOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Category"
              />
            </Form.Item>

            <Button
              htmlType="submit"
              type="primary"
              loading={createCategoryLoading}
            >
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

        <Section
          title="New Total"
          description="Add a new total to group categories by."
        >
          <Form form={newTotalForm} onFinish={onCreateTotal} layout="vertical">
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input total name!',
                },
              ]}
            >
              <Input
                type="text"
                disabled={createCategoryLoading}
                prefix={<FundOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Name"
              />
            </Form.Item>

            <TotalsList>
              <Form.List
                name="categories"
                rules={[
                  {
                    validator: async (_, categories) => {
                      if (
                        !categories ||
                        Array.from(new Set(categories)).length < 2
                      ) {
                        return Promise.reject(
                          new Error('At least 2 unique categories')
                        );
                      }
                    },
                  },
                ]}
              >
                {(fields, { add }, { errors }) => (
                  <>
                    <div>
                      {fields.map((field) => (
                        <Form.Item
                          key={field.key}
                          name={field.name}
                          rules={[
                            {
                              required: true,
                              message: 'Please select category',
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
                      ))}
                    </div>

                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      disabled={createTotalLoading}
                      icon={<PlusOutlined />}
                    >
                      Add category
                    </Button>

                    <TotalsErrorsList errors={errors} />
                  </>
                )}
              </Form.List>
            </TotalsList>

            <Button
              htmlType="submit"
              type="primary"
              loading={createTotalLoading}
              style={{ marginTop: '2rem' }}
            >
              Add Total
            </Button>
          </Form>
        </Section>

        <Section
          title="Totals"
          description="List of sum categories for this event."
        >
          {totals.length === 0 ? (
            <EmptyData
              title="No Totals Added as Yet"
              description="Fortunately, it’s very easy to create one."
            />
          ) : (
            totals.map((a) => (
              <Popconfirm
                key={a.id}
                title="Are you sure want to delete this total?"
                onConfirm={() => onDeleteTotal(a)}
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

const TotalsList = styled.div`
  margin-top: 1rem;
`;

const TotalsErrorsList = styled(Form.ErrorList)`
  margin-top: 1rem;
`;
