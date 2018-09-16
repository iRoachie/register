import React from 'react';
import { Card, Button, Form, Input, Icon, message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { FormComponentProps } from 'antd/lib/form';
import { firebase } from 'config';

import styled from '@styled';

interface State {
  loading: boolean;
}

type Props = RouteComponentProps & FormComponentProps;

class NewEvent extends React.Component<Props, State> {
  state = {
    loading: false,
  };

  submitHander = (event: React.SyntheticEvent) => {
    event.preventDefault();

    this.props.form!.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true }, () => this.createEvent(values.name));
      }
    });
  };

  createEvent = async (name: string) => {
    try {
      const event = await firebase
        .firestore()
        .collection('events')
        .add({
          name,
          createdAt: Date.now(),
        });

      this.setState({ loading: false });

      message.success(`Event "${name}" created.`, 3, () => {
        this.props.history.push(`/events/${event.id}`);
      });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form!;

    return (
      <Content>
        <Title>Create New Event</Title>

        <Form onSubmit={this.submitHander}>
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input event name!' }],
            })(
              <Input
                type="text"
                disabled={loading}
                prefix={
                  <Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Event Name"
              />
            )}
          </Form.Item>

          <Button htmlType="submit" type="primary" loading={loading}>
            Create Event
          </Button>
        </Form>
      </Content>
    );
  }
}

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

export default Form.create()(NewEvent);
