import React from 'react';
import { Attendee, Category } from 'utils';
import { Form, List, Input, Select, Button, Icon } from 'antd';
import styled from '@styled';
import { FormComponentProps } from 'antd/lib/form';

interface Props extends FormComponentProps {
  attendee: Attendee;
  categories: Category[];
  updating: boolean;
  cancelEditing(attendeeId: string): void;
  updateAttendee(attendee: Attendee): void;
}

class AttendeeEdit extends React.Component<Props> {
  componentDidMount() {
    const { name, category } = this.props.attendee;
    this.props.form.setFieldsValue({
      name,
      category: category ? category.id : null,
    });
  }

  submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const { categories, updateAttendee, attendee } = this.props;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { name, category: categoryId } = values;
        const category = categories.find(a => a.id === categoryId)!;
        updateAttendee({ ...attendee, name, category });
      }
    });
  };

  render() {
    const { attendee, categories, cancelEditing, updating } = this.props;

    const { getFieldDecorator } = this.props.form;

    return (
      <List.Item>
        <Container>
          <Title>Editing: {attendee.name}</Title>

          <Form onSubmit={this.submitHandler}>
            <Inputs>
              <Form.Item>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input attendee name!',
                    },
                  ],
                })(
                  <Input
                    type="text"
                    disabled={updating}
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="Attendee name"
                  />
                )}
              </Form.Item>

              <Form.Item>
                {getFieldDecorator('category', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select attendee category!',
                    },
                  ],
                })(
                  <Select placeholder="Category">
                    {categories.map(a => (
                      <Select.Option value={a.id} key={a.id}>
                        {a.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
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
  }
}

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

export default Form.create()(AttendeeEdit);
