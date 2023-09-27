declare global {
  interface Window {
    electron: {
      deleteDatabase: () => Promise<void>;
      setupDatabase: () => Promise<void>;
      sendMsg(msg: string): Promise<string>,
      onReplyMsg(cb: (msg: string) => any): void
      onDatabaseMsg(cb: (msg: string) => any): void
    }
  }
}

export { }
