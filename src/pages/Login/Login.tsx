import React from 'react';
import styled from '@styled';
import { RouteComponentProps } from 'react-router';
import { Button, Card, Input, Form, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { Loading } from 'components';
import { firebase } from 'config';

const FormItem = Form.Item;

interface State {
  checkingAuth: boolean;
  loading: boolean;
  error: string;
}

class Login extends React.Component<
  FormComponentProps & RouteComponentProps,
  State
> {
  state = {
    checkingAuth: true,
    loading: false,
    error: '',
  };

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ checkingAuth: false }, () => {
        if (user) {
          this.props.history.push('/');
        }
      });
    });
  }

  handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    this.setState({ error: '' });

    this.props.form!.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true }, () => this.login(values));
      }
    });
  };

  login = async ({ email, password }: { email: string; password: string }) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      this.setState({ loading: false });
    } catch (error) {
      let message = 'Error logging in';

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Incorrect email or password';
          break;
        default:
          console.log(error);
      }

      this.setState({ loading: false, error: message });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form!;
    const { loading, error, checkingAuth } = this.state;

    return checkingAuth ? (
      <Loading />
    ) : (
      <Container>
        <Box>
          <h1>Login</h1>

          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Please input your username!' },
                ],
              })(
                <Input
                  size="large"
                  type="email"
                  disabled={loading}
                  prefix={
                    <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Email Address"
                />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your password!' },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  disabled={loading}
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Password"
                />
              )}
            </FormItem>

            <Error>{error}</Error>

            <LoginButton htmlType="submit" type="primary" loading={loading}>
              Log in
            </LoginButton>
          </Form>
        </Box>
      </Container>
    );
  }
}

/** Styles */
const Container = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Box = styled(Card)`
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const LoginButton = styled(Button).attrs({
  size: 'large',
})`
  width: 100%;
`;

const Error = styled.p`
  color: ${({ theme }) => theme.colors.error};
`;

export default Form.create()(Login as any);
