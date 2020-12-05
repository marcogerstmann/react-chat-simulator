import * as React from 'react';
import { KeyboardEvent, ChangeEvent, FunctionComponent } from 'react';
import './MessageInput.scss';

interface MessageInputProps {
  messageText: string,
  handleMessageChange: Function,
  handleMessageSubmit: Function
}

export const MessageInput: FunctionComponent<MessageInputProps> = props => {

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    props.handleMessageChange(e.target.value);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      props.handleMessageSubmit();
    }
  };

  return <textarea className='msg-input w-100' value={props.messageText} onChange={onChange} onKeyDown={onKeyDown} />;
};
