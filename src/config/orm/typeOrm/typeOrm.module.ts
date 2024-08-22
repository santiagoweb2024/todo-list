import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { REGISTER_AS_CONFIG_NAMES } from 'src/shared/constants/registerAsConfigNames';
import { User } from 'src/users/entities/user.entity';
import { RefreshToken } from 'src/auth/entities/refreshToken.entity';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get(REGISTER_AS_CONFIG_NAMES.DATABASE);
        return {
          ...dbConfig,
          entities: [User, RefreshToken],
          synchronize: true,
          dropSchema: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrm {}
