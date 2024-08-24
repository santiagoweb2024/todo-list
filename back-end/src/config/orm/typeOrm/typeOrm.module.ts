import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshToken } from '@/auth/entities/refreshToken.entity';
import { REGISTER_AS_CONFIG_NAMES } from '@/shared/constants/registerAsConfigNames';
import { User } from '@/users/entities/user.entity';

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
          dropSchema: false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrm {}
