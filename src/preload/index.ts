import {contextBridge, ipcRenderer} from 'electron'

contextBridge.exposeInMainWorld(
    'electron',
    {
        deleteDatabase: (): Promise<void> => ipcRenderer.invoke('delete-database'),
        setupDatabase: (): Promise<void> => ipcRenderer.invoke('setup-database'),
        sendMsg: (msg: string): Promise<string> => ipcRenderer.invoke('msg', msg),
        onReplyMsg: (cb: (msg: string) => any) => ipcRenderer.on('reply-msg', (e, msg: string) => {
            cb(msg)
        }),
        onDatabaseMsg: (cb: (msg: string) => any) => ipcRenderer.on('database-msg', (e, msg: string) => {
            cb(msg)
        }),
    },
)
