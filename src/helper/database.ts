import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FactoryProvider, Logger } from '@nestjs/common';
import { CONNECTIONS_PROVIDER } from 'src/constants/tokens';
import { Connection } from 'mongoose';

export const getCurDabaseName = () => {
  const endDate = new Date();
  const endYear = endDate.getFullYear();
  return `account_${endYear}`;
};

export const getDabaseName = (date) => {
  const year = date.getFullYear();
  return `account_${year}`;
};
export const getDatabaseNames = () => {
  const startDate = new Date('2015-01-01T00:00:00Z');
  const endDate = new Date();
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  let result = [];
  for (let index = startYear; index <= endYear; index++) {
    result.push(`account_${index}`);
  }
  return result;
};

export const getConnections = () => {
  let listName = getDatabaseNames();
  let result = [];
  for (let index = 0; index < listName.length; index++) {
    const connect = MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        uri: `mongodb://localhost:27017/${listName[index]}`,
      }),
      connectionName: listName[index],
      inject: [ConfigService],
    });
    result.push(connect);
  }
  return result;
};

export const getConnProviders = () => {
  const databaseConnectionNames = getDatabaseNames();
  const connectionsProvider: FactoryProvider = {
    provide: CONNECTIONS_PROVIDER,
    useFactory: (...connections: Connection[]) => {
      const connectionMap = new Map<string, Connection>();
      connections.forEach((conn) => {
        // Logger.log(`Connect ${conn.name}`);
        // Logger.log(conn.eventNames);
        connectionMap.set(conn.name, conn);
      });
      return connectionMap;
    },
    inject: databaseConnectionNames.map(getConnectionToken),
  };
  return connectionsProvider;
};
