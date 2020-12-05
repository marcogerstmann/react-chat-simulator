export class User {

  constructor(public userName: string,
    public unreadMessagesCount = 0,
    public hasPrivateMessages?: boolean) {
  }

  incrementUnreadMessageCount(): void {
    this.hasPrivateMessages = true;
    this.unreadMessagesCount++;
  }

  resetUnreadMessageCount(): void {
    this.unreadMessagesCount = 0;
  }
}
