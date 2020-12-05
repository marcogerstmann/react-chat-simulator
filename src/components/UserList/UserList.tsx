import * as React from 'react';
import { FunctionComponent } from 'react';
import { User } from '../../models/User';
import './UserList.scss';

interface UserListProps {
  users: User[],
  handleUserClick: Function,
  handleUserHover: Function,
  activeUserName?: string
}

export const UserList: FunctionComponent<UserListProps> = props => {

  const onUserClick = (userName: string) => {
    props.handleUserClick(userName);
  };

  const onUserHover = (userName: string) => {
    props.handleUserHover(userName);
  };

  const getUserClasses = (user: User): string => {
    let classes = props.activeUserName === user.userName ? ' active' : '';
    classes += user.hasPrivateMessages ? ' has-private-messages' : '';
    return classes;
  };

  return (
    <div className='card h-100'>
      <div className='card-header p-0'>
        <div className='user-count font-weight-bold p-2'>Anzahl Personen: {props.users.length}</div>
      </div>
      <div className='card-body p-0'>
        {props.users.map(u => (
          <div key={u.userName}
            className={`user-item pt-1 pb-1 pl-2${getUserClasses(u)}`}
            onClick={() => onUserClick(u.userName)}
            onMouseEnter={() => onUserHover(u.userName)}
            onMouseLeave={() => onUserHover('')}>
            {u.userName}
            {u.unreadMessagesCount ? <span className="badge badge-secondary ml-2">{u.unreadMessagesCount}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
};
