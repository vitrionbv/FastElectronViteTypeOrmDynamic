import {DataSource} from 'typeorm'
import {store} from "@main/store";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";
import {app} from "electron";

export const dataSourceConfig = ({
                                     database,
                                     synchronize
                                 }: {
    database: string
    synchronize: boolean
}): DataSourceOptions => {
    let db = database === undefined ? app.getPath('userData')+'/database.sqlite' : database;
    console.log(db);
    return  {
        type: "sqlite",
        database:db,
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize
    }
}
