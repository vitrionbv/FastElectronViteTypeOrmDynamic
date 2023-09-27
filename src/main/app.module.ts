import {join} from 'node:path'
import {Module} from '@nestjs/common'
import {ElectronModule} from '@doubleshot/nest-electron'
import {BrowserWindow, app} from 'electron'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {TypeOrmModule} from '@nestjs/typeorm';
import {store} from "@main/store";
import {dataSourceConfig} from "@main/data-source";

@Module({
    imports: [ElectronModule.registerAsync({
        useFactory: async () => {
            const isDev = !app.isPackaged
            const win = new BrowserWindow({
                width: 1200,
                height: 800,
                autoHideMenuBar: true,
                webPreferences: {
                    contextIsolation: true,
                    preload: join(__dirname, '../preload/index.js'),
                },
            })

            win.on('closed', () => {
                win.destroy()
            })

            const URL = isDev
                ? process.env.DS_RENDERER_URL
                : `file://${join(app.getAppPath(), 'dist/render/index.html')}`

            await win.loadURL(URL)

            return {win}
        },
    }),
        TypeOrmModule.forRoot(dataSourceConfig({
            database: store.get('databasePath'),
            synchronize: true
        }))
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
