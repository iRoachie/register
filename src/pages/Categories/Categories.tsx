import React from 'react';
import { Wrapper, Loading } from 'components';
import { firebase } from 'config';
import { IEvent } from 'utils';
import styled from '@styled';
import { Form, Input, Icon, Button, message, Tag } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'react-router';

import NoCategories from './components/NoCategories';
import Section from './components/Section';

interface State {
  fetching: boolean;
  loading: boolean;
  event: IEvent | null;
}

interface Params {
  eventId: string;
}

type Props = FormComponentProps & RouteComponentProps<Params>;

class Categories extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fetching: true,
      loading: false,
      event: null,
    };
  }

  componentDidMount() {
    this.getCategories();
  }

  getCategories = async () => {
    try {
      const { eventId } = this.props.match.params;

      const response = await firebase
        .firestore()
        .collection('events')
        .doc(eventId)
        .get();

      const event = response.data() as IEvent;

      this.setState({ event, fetching: false });
    } catch (error) {
      this.setState({ fetching: false });
      console.error(error);
    }
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
      const { event } = this.state;
      const { eventId } = this.props.match.params;

      if (event!.categories && event!.categories!.includes(category)) {
        message.error('Category already added');
        this.setState({ loading: false });
        return;
      }

      const changes = {
        ...event,
        categories: [...(event!.categories || []), category],
      };

      await firebase
        .firestore()
        .collection('events')
        .doc(eventId)
        .set(changes);

      this.props.form.setFields({ category: '' });

      await this.getCategories();

      this.setState({ loading: false });

      message.success(`Category "${category}" created.`, 3);
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { loading, fetching, event } = this.state;
    const { getFieldDecorator } = this.props.form;

    if (fetching) {
      return <Loading />;
    }

    if (!!event) {
      const categories = event.categories || [];

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
                <NoCategories />
              ) : (
                categories.map(a => <CategoryTag key={a}>{a}</CategoryTag>)
              )}
            </Section>
          </Wrapper>
        </Container>
      );
    }

    return null;
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
