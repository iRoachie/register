import React from 'react';
import { Wrapper, Hr, Loading } from 'components';
import { firebase } from 'config';
import { IEvent } from 'utils';
import styled from '@styled';
import { Form, Input, Icon, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'react-router';

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
    const { loading, fetching } = this.state;
    const { getFieldDecorator } = this.props.form;

    return fetching ? (
      <Loading />
    ) : (
      <Container>
        <Wrapper>
          <Header>
            <h2>Categories</h2>
            <p>Categories are meta in which attendees are grouped by.</p>
            <Hr />
          </Header>

          <Form onSubmit={this.submitHandler} layout="inline">
            <Form.Item>
              {getFieldDecorator('category', {
                rules: [
                  { required: true, message: 'Please input category name!' },
                ],
              })(
                <Input
                  size="large"
                  type="text"
                  disabled={loading}
                  prefix={
                    <Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Category"
                />
              )}
            </Form.Item>

            <Button
              htmlType="submit"
              size="large"
              type="primary"
              loading={loading}
            >
              Add Category
            </Button>
          </Form>
        </Wrapper>
      </Container>
    );
  }
}

export default Form.create()(Categories);

const Container = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 15px;
`;
