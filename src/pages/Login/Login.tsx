import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Form } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { Loading } from '../../components';
import { auth } from '../../config';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { usePageTitle } from '../../utils/usePageTitle';
import { FirebaseError } from 'firebase/app';

export const Login = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  usePageTitle('Login');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCheckingAuth(false);

      if (user) {
        navigate('/');
      }
    });

    return unsubscribe;
  }, [navigate]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
    } catch (error) {
      let message = 'Error logging in';

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            message = 'Incorrect email or password';
            break;
          default:
            console.log(error);
        }
      }

      setError(message);
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return <Loading />;
  }

  return (
    <Container>
      <Box>
        <h1>Login</h1>
        <Form form={form} onFinish={login}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              type="email"
              disabled={loading}
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email Address"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input
              type="password"
              disabled={loading}
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Password"
            />
          </Form.Item>

          <Error>{error}</Error>

          <LoginButton htmlType="submit" type="primary" loading={loading}>
            Log in
          </LoginButton>
        </Form>
      </Box>
    </Container>
  );
};

// /** Styles */
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

const LoginButton = styled(Button)`
  width: 100%;
`;

const Error = styled.p`
  color: ${({ theme }) => theme.colors.error};
`;
