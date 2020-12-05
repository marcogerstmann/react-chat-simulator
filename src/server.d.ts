type Observers = {
	onMessage(senderName: string, text: string): void;
	onPrivateMessage(senderName: string, receiverName: string, text: string): void;
	onUserJoined(name: string): void;
	onUserLeft(name: string): void;
}

declare interface Window {
	serverInterface: {
		registerObserver<T extends keyof Observers>(event: T, observer: Observers[T]): void;
		removeObserver<T extends keyof Observers>(event: T, observer: Observers[T]): void;

		sendMessage(text: string): void;
		sendPrivateMessage(receiverName: string, text: string): void;
	}
}
