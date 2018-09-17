import React from 'react';
import { Wrapper, Loading, Section, EmptyData } from 'components';
import { firebase } from 'config';
import { Category } from 'utils';
import styled from '@styled';
import { Form, Input, Icon, Button, message, Tag } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'react-router';

interface State {
  fetching: boolean;
  loading: boolean;
  categories: Category[];
}

interface Params {
  eventId: string;
}

type Props = FormComponentProps & RouteComponentProps<Params>;

class Categories extends React.Component<Props, State> {
  categoriesSubscription: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      fetching: true,
      loading: false,
      categories: [],
    };
  }

  componentDidMount() {
    const { eventId } = this.props.match.params;

    this.categoriesSubscription = firebase
      .firestore()
      .collection('events')
      .doc(eventId)
      .collection('categories')
      .onSnapshot(this.updateCategories);
  }

  componentWillUnmount() {
    this.categoriesSubscription();
  }

  updateCategories = (snapshot: firebase.firestore.QuerySnapshot) => {
    const categories = snapshot.docs.map(
      a =>
        ({
          ...a.data(),
          id: a.id,
        } as Category)
    );

    this.setState({ categories, fetching: false });
  };

  submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();

    this.props.form!.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true }, () =>
          this.createCategory(values.category)
        );
      }
    });
  };

  createCategory = async (category: string) => {
    try {
      const { categories } = this.state;
      const { eventId } = this.props.match.params;

      if (
        categories &&
        categories.find(a => a.name.toLowerCase() === category.toLowerCase())
      ) {
        message.error('Category already added');
        this.setState({ loading: false });
        return;
      }

      await firebase
        .firestore()
        .collection('events')
        .doc(eventId)
        .collection('categories')
        .add({ name: category });

      message.success(`Category "${category}" created.`, 3);

      this.props.form.setFields({ category: '' });
      this.setState({ loading: false });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { loading, fetching, categories } = this.state;
    const { getFieldDecorator } = this.props.form;

    if (fetching) {
      return <Loading />;
    }

    return (
      <Container>
        <Wrapper>
          <Section
            title="New Category"
            description="Add a new category to group attendees by."
          >
            <CategoryForm onSubmit={this.submitHandler} layout="inline">
              <Form.Item>
                {getFieldDecorator('category', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input category name!',
                    },
                  ],
                })(
                  <Input
                    type="text"
                    disabled={loading}
                    prefix={
                      <Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="Category"
                  />
                )}
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
              categories.map(a => (
                <CategoryTag key={a.id}>{a.name}</CategoryTag>
              ))
            )}
          </Section>
        </Wrapper>
      </Container>
    );
  }
}

const Container = styled.div`
  margin-top: 30px;
`;

// @ts-ignore
const CategoryForm = styled(Form)`
  display: flex;
  align-items: center;
`;

const CategoryTag = styled(Tag)`
  font-size: 14px;
`;

export default Form.create()(Categories);
