import * as React from 'react';
import * as Constants from '../../constants';
import { ChatMessage } from '../../models/ChatMessage';
import { MessageList } from '../../components/MessageList/MessageList';
import { MessageInput } from '../../components/MessageInput/MessageInput';
import ScrollableFeed from 'react-scrollable-feed';
import './Chat.scss';

interface ChatState {
  messageText: string,
  maxVisibleMessages: number
}

interface ChatProps {
  messages: ChatMessage[],
  privateChatUserName?: string,
  hoveredUserName?: string,
  handlePrivateChatClose?: Function
}

/**
 * A chat is a single chat window with a list of messages and a chat input. It can be a public or a private chat.
 */
class Chat extends React.Component<ChatProps, ChatState> {

  private scrollRef: ScrollableFeed | null;

  constructor(props: ChatProps) {
    super(props);
    this.state = { messageText: '', maxVisibleMessages: Constants.MESSAGES_PER_PAGE };
    this.scrollRef = null;
  }

  componentDidMount() {
    (this.scrollRef as any)?.wrapperRef.current.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    (this.scrollRef as any)?.wrapperRef.current.removeEventListener('scroll', this.handleScroll);
  }

  handleMessageChange = (message: string) => {
    this.setState({ messageText: message });
  };

  handleSendMessage = () => {
    const trimmedMessage = this.state.messageText.trim();
    if (trimmedMessage) {
      this.props.privateChatUserName
        ? window.serverInterface.sendPrivateMessage(this.props.privateChatUserName, trimmedMessage)
        : window.serverInterface.sendMessage(trimmedMessage);
      this.setState({ messageText: '' });
    }
  };

  handlePrivateChatCloseClick = () => {
    if (this.props.handlePrivateChatClose) {
      this.props.handlePrivateChatClose();
    }
  };

  handleScroll = () => {
    if (this.isScrolledToTop()) {
      if (this.state.maxVisibleMessages < this.props.messages.length) {
        this.setState({ maxVisibleMessages: this.state.maxVisibleMessages + Constants.MESSAGES_PER_PAGE })
      }
    }
  }

  isScrolledToTop(): boolean {
    const scrollWrapper = (this.scrollRef as any)?.wrapperRef;
    return scrollWrapper.current.scrollTop <= 50;
  }

  render() {
    return (
      <div className='card h-100'>
        {
          this.props.privateChatUserName ? (
            <div className='card-header private-chat-title p-2 font-weight-bold'>
              <span className='private-chat-title-label'>Privates Gespräch mit {this.props.privateChatUserName}</span>
              <button className='btn btn-danger btn-sm float-right'
                onClick={this.handlePrivateChatCloseClick}>
                X
              </button>
            </div>
          ) : null
        }
        <div className='card-body p-0 h-100 overflow-hidden'>
          <ScrollableFeed className='scrollable-feed'
            ref={ref => this.scrollRef = ref}
            viewableDetectionEpsilon={20}>
            <MessageList {...this.props}
              maxVisibleMessages={this.state.maxVisibleMessages}
              isPrivateChat={!!this.props.privateChatUserName} />
          </ScrollableFeed>
        </div>
        <div className='card-footer p-1'>
          <MessageInput messageText={this.state.messageText}
            handleMessageChange={this.handleMessageChange}
            handleMessageSubmit={this.handleSendMessage} />
        </div>
      </div>
    );
  }
}

export default Chat;
