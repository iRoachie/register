import React from 'react';
import { firebase } from 'config';

const AuthContext = React.createContext({ loggedIn: null });

interface Props {
  children: React.ReactNode;
}

interface State {
  loggedIn: boolean | null;
}

class AuthProvider extends React.Component<Props, State> {
  state = {
    loggedIn: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ loggedIn: !!user });
    });
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthConsumer, AuthProvider };
