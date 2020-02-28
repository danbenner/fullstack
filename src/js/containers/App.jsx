import React from 'react';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/SinglePageApp/Header';
import Navigator from '../components/SinglePageApp/Navigator';
import Content from '../components/SinglePageApp/Content';
import SinglePageApp from '../components/SinglePageApp/Theme';

// Get user's CN# & AD Groups
const cookies = new Cookies();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      portalUserCN: cookies.get('userID'),
    };
  }

  render() {
    const { portalUserCN } = this.state;

    return (
      <Router>
        <SinglePageApp>
          <Header portalUserCN={portalUserCN} />
          <Navigator />
          <Content />
        </SinglePageApp>
      </Router>
    );
  }
}

export default App;
