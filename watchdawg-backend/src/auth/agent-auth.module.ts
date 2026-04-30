/** @format */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from 'src/database/database.module';

import { JwtStrategy } from '../auth/stratergies/jwt.strategy'; // reuse same strategy
import { AgentAuthController } from './agent-auth.controller';
import { AgentAuthService } from './agent-auth.service';

@Module({
  imports: [
    DatabaseModule,

    /* 🔥 ENV (SHARED) */
    ConfigModule,

    /* 🔐 JWT (SAME CONFIG AS AUTH) */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'), // 🔥 SAME SECRET
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],

  controllers: [AgentAuthController],

  providers: [
    AgentAuthService,

    /* 🔥 IMPORTANT: register strategy */
    JwtStrategy,
  ],

  exports: [AgentAuthService],
})
export class AgentAuthModule {}
