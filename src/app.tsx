import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import ChatContainer from './containers/ChatContainer/ChatContainer';

/**
 * Entry point of the react app.
 * Please have a look into README.md
 */
class App extends React.Component {
  render() {
    return (
      /**
       * Use a chat container instead of <App> directly so we can later add higher order components like a layout, navigation and a channel
       * list, where each of them could open a new chat container.
       */
      <ChatContainer />
    );
  }
}

export default hot(App);
