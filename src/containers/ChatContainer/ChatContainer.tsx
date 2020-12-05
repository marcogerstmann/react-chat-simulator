import * as React from 'react';
import { differenceWith } from 'lodash';
import Chat from '../Chat/Chat';
import { ChatMessage } from '../../models/ChatMessage';
import * as Constants from '../../constants';
import { UserList } from '../../components/UserList/UserList';
import { User } from '../../models/User';

interface ChatContainerState {
  chatMessages: ChatMessage[],
  users: User[],
  activeUserName?: string,
  hoveredUserName?: string
}

/**
 * A chat container holds a public chat, a private chat (if opened) and a list of users.
 * It could later be used per chat channel.
 */
class ChatContainer extends React.Component<{}, ChatContainerState> {

  constructor(props: {}) {
    super(props);
    this.state = { chatMessages: [], users: [] };
    this.registerObserver('onUserJoined', this.onUserJoined);
    this.registerObserver('onUserLeft', this.onUserLeft);
    this.registerObserver('onMessage', this.onIncomingMessage);
    this.registerObserver('onPrivateMessage', this.onIncomingPrivateMessage);
  }

  registerObserver(event: 'onUserJoined' | 'onUserLeft' | 'onMessage' | 'onPrivateMessage', observer: any) {
    window.serverInterface.removeObserver(event, observer);
    window.serverInterface.registerObserver(event, observer);
  }

  componentWillUnmount() {
    window.serverInterface.removeObserver('onMessage', this.onIncomingMessage);
    window.serverInterface.removeObserver('onUserJoined', this.onUserJoined);
    window.serverInterface.removeObserver('onUserLeft', this.onUserLeft);
  }

  onIncomingMessage = (userName: string, text: string) => {
    this.handleIncomingMessage(userName, text);
  };

  onIncomingPrivateMessage = (userName: string, receiverName: string, text: string) => {
    this.handleIncomingMessage(userName, text, receiverName);
  };

  onUserJoined = (userName: string) => {
    if (!this.state.users.find(u => u.userName === userName)) {
      const userList = [...this.state.users];
      const joinedUser = new User(userName);

      // State as user with private messages if re-joined
      if (this.state.chatMessages.some(m => m.isPrivate() && m.userName === userName)) {
        joinedUser.hasPrivateMessages = true;
      }

      userList.push(joinedUser);
      this.setState({ users: userList });
    }
  };

  onUserLeft = (userName: string) => {
    const index = this.state.users.findIndex(u => u.userName === userName);
    if (index >= 0) {
      const users = [...this.state.users];
      users.splice(index, 1);
      this.setState({ users });
    }
  };

  handleIncomingMessage(userName: string, text: string, receiverName?: string) {
    const isPrivate = !!receiverName;
    if (isPrivate) {
      this.incrementUserMessageCount(userName);
    }

    const chatMessages = [...this.state.chatMessages, new ChatMessage(userName, text, receiverName)];
    if (chatMessages.length > Constants.MAX_LOCAL_MESSAGES) {
      chatMessages.shift();
    }

    this.setState({ chatMessages });
  }

  incrementUserMessageCount(userName: string) {
    const user = this.state.users.find(u => u.userName === userName);
    user?.incrementUnreadMessageCount();
  }

  resetUserMessageCount(userName?: string) {
    if (userName) {
      const user = this.state.users.find(u => u.userName === userName);
      user?.resetUnreadMessageCount();
    }
  }

  handleUserClick(userName: string) {
    this.setState({ activeUserName: userName });
  }

  handleUserHover(userName: string) {
    this.setState({ hoveredUserName: userName });
  }

  handlePrivateChatClose() {
    this.setState({ activeUserName: undefined });
  }

  isPrivateChatActive(): boolean {
    this.resetUserMessageCount(this.state.activeUserName);
    return !!this.state.activeUserName;
  }

  /**
   * Gets all public messages without the ones inside the active private chat
   */
  getMessagesWithoutActivePrivateChat(): ChatMessage[] {
    return differenceWith(this.state.chatMessages, this.getActivePrivateChatMessages());
  }

  getActivePrivateChatMessages(): ChatMessage[] {
    return this.state.chatMessages.filter(m => (m.isPrivate() && m.userName === this.state.activeUserName)
      || (m.receiverName === this.state.activeUserName && m.userName === Constants.MYSELF));
  }

  render() {
    const getPublicChatMessages = (): ChatMessage[] => {
      return this.isPrivateChatActive() ? this.getMessagesWithoutActivePrivateChat() : this.state.chatMessages;
    };

    const getPrivateChatMessages = (): ChatMessage[] => {
      return this.getActivePrivateChatMessages();
    };

    return (
      <div className='row h-100 m-0'>
        <div className={`col-sm-${this.isPrivateChatActive() ? '5' : '10'} h-100 p-0`}>
          <Chat messages={getPublicChatMessages()}
            hoveredUserName={this.state.hoveredUserName} />
        </div>
        {
          this.isPrivateChatActive() ? (
            <div className='col-sm-5 h-100 p-0'>
              <Chat privateChatUserName={this.state.activeUserName}
                handlePrivateChatClose={() => this.handlePrivateChatClose()}
                messages={getPrivateChatMessages()} />
            </div>
          ) : null
        }
        <div className='col-sm-2 h-100 p-0'>
          <UserList users={this.state.users}
            handleUserClick={(u: string) => this.handleUserClick(u)}
            handleUserHover={(u: string) => this.handleUserHover(u)}
            activeUserName={this.state.activeUserName} />
        </div>
      </div>
    );
  }
}

export default ChatContainer;
