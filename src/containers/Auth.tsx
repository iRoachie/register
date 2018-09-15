import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const AuthContext = React.createContext({ loggedIn: false });

interface Props {
  children: React.ReactNode;
}

interface State {
  loggedIn: boolean;
}

class AuthProvider extends React.Component<Props, State> {
  state = {
    loggedIn: false,
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
