import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrm } from './config/orm/typeOrm/typeOrm.module';
import configDatabase from './config/orm/typeOrm/configDatabase';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configDatabase] }),
    TypeOrm,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
