export interface IMessageHandler {
  handleMessage(msg: string): Promise<void>;
}
