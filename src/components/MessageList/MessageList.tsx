import * as React from 'react';
import { FunctionComponent } from 'react';
import { takeRight } from 'lodash';
import * as Constants from '../../constants';
import Aux from '../../hoc/Auxiliary';
import { ChatMessage } from '../../models/ChatMessage';
import './MessageList.scss';

interface MessageListProps {
  messages: ChatMessage[],
  maxVisibleMessages: number,
  isPrivateChat?: boolean,
  hoveredUserName?: string
}

export const MessageList: FunctionComponent<MessageListProps> = props => {

  const isPrivateMessageInPublicChat = (message: ChatMessage) => {
    return message.receiverName && !props.isPrivateChat;
  };

  return (
    <Aux>
      {
        takeRight(props.messages, props.maxVisibleMessages)
          .map((message, index) => {
            return (
              <div key={index} className={`chat-msg ${props.hoveredUserName === message.userName ? 'highlight' : ''}`}>
                <div className='chat-msg-user'>
                  {message.userName}
                  {isPrivateMessageInPublicChat(message) ? ` (privat an ${message.receiverName === Constants.MYSELF ? 'dich' : message.receiverName})` : ''}:
                </div>
                <div className='chat-msg-text'>
                  {message.text}
                </div>
              </div>
            );
          })
      }
    </Aux>
  );
};
