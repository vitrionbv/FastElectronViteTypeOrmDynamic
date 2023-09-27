import { Controller } from '@nestjs/common'
import { IpcHandle, Window } from '@doubleshot/nest-electron'
import { Payload } from '@nestjs/microservices'
import { type Observable, of } from 'rxjs'
import {app, BrowserWindow, dialog} from 'electron'
import { AppService } from './app.service'
import {DataSource} from "typeorm";
import {dataSourceConfig} from "@main/data-source";
import {store} from "@main/store";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Window() private readonly mainWin: BrowserWindow,
  ) {
    console.log('test');
  }

  @IpcHandle('msg')
  public handleSendMsg(@Payload() msg: string): Observable<string> {
    const { webContents } = this.mainWin
    webContents.send('reply-msg', 'this is msg from webContents.senddd')
    return of(`The main process received your message: ${msg} at time: ${this.appService.getTime()}`)
  }

  @IpcHandle('setup-database')
  public async testConnection(): Promise<void> {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    if (result.canceled || result.filePaths.length === 0) {
      throw new Error('No directory selected')
    }
    const selectedDirectory = result.filePaths[0]
    const databasePath = `${selectedDirectory}/database.sqlite`
    const dataSource = new DataSource(dataSourceConfig({
      database: databasePath,
      synchronize: true
    }))
    await dataSource.initialize()
    if (!dataSource.isInitialized) {
      throw new Error('Database not initialized')
    }
    await dataSource.destroy()
    store.set('databasePath', databasePath)
    app.relaunch()
    app.exit(0)
  }

  @IpcHandle('delete-database')
  public async deleteDatabasePath(): Promise<void> {
    store.delete('databasePath')
    app.relaunch()
    app.exit(0)
  }

}
