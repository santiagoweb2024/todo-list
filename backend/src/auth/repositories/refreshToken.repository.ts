import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refreshToken.entity';
export interface IRefreshTokenRepository {}

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshToken: Repository<RefreshToken>,
  ) {}
}
