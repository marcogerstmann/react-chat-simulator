export class ChatMessage {

  constructor(public userName: string,
    public text: string,
    public receiverName?: string) {
  }

  isPrivate(): boolean {
    return !!this.receiverName;
  }

}
