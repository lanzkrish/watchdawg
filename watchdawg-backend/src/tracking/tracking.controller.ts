/** @format */

import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { UnifiedGateway } from '../gateway/unified.gateway';
import { ActivityDto } from './dto/activity.dto';
import { TrackingService } from './tracking.service';

/* ============================== */
/* 🧠 TYPES                       */
/* ============================== */

type ActivityCategory = 'productive' | 'neutral' | 'distracting';

/* ============================== */
/* 🧠 HELPERS                     */
/* ============================== */

function normalizeCategory(input?: string): ActivityCategory {
  if (input === 'productive') return 'productive';
  if (input === 'distracting') return 'distracting';
  return 'neutral';
}

/* ============================== */
/* 🚀 CONTROLLER                  */
/* ============================== */

@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly trackingService: TrackingService,
    private readonly unifiedGateway: UnifiedGateway,
    private readonly usersService: UsersService, // ✅ fixed naming
  ) {}

  @Post('activity')
  async logActivity(@Body() body: ActivityDto) {
    console.log('📥 RAW PAYLOAD:', JSON.stringify(body, null, 2));

    try {
      /* ============================== */
      /* 🔒 VALIDATION                  */
      /* ============================== */

      if (!body.userId || !body.organizationId) {
        throw new BadRequestException('Missing user info');
      }

      if (!body.app || typeof body.app !== 'string') {
        throw new BadRequestException('Invalid app');
      }

      if (typeof body.duration !== 'number' || body.duration <= 0) {
        throw new BadRequestException(`Invalid duration: ${body.duration}`);
      }

      if (body.background) {
        if (
          typeof body.background.duration !== 'number' ||
          body.background.duration <= 0
        ) {
          throw new BadRequestException(
            `Invalid background duration: ${body.background.duration}`,
          );
        }

        if (!body.background.app) {
          throw new BadRequestException('Invalid background app');
        }
      }

      /* ============================== */
      /* 💾 SAVE TO DB                 */
      /* ============================== */

      await this.trackingService.logActivity(body);

      console.log(`✅ Activity stored: ${body.app} | ${body.duration}s`);

      /* ============================== */
      /* 👤 FETCH USER (PRODUCTION WAY) */
      /* ============================== */

      let name = `User-${body.userId.slice(0, 4)}`;

      try {
        const user = await this.usersService.findById(body.userId);

        if (user) {
          name =
            user.full_name?.trim() || user.name?.trim() || user.email || name;
        }
      } catch (err) {
        console.warn('⚠️ User fetch failed, using fallback');
      }

      /* ============================== */
      /* 🧹 NORMALIZE                   */
      /* ============================== */

      const normalized = {
        userId: body.userId,
        organizationId: body.organizationId,

        name, // ✅ real user name

        app: body.app,
        title: body.title || '',
        platform: body.platform || 'Unknown',

        category: normalizeCategory(body.category),
        status: body.status || 'active',

        duration: body.duration,

        background: body.background
          ? {
              app: body.background.app,
              type: body.background.type || 'music',
              duration: body.background.duration,
            }
          : null,

        timestamp: body.timestamp || Date.now(),
      };

      console.log('📡 [DISPATCH → UNIFIED]', normalized);

      /* ============================== */
      /* 🚀 REALTIME PIPELINE           */
      /* ============================== */

      this.unifiedGateway.sendActivity(normalized);

      return { success: true };
    } catch (err: any) {
      console.error('❌ CONTROLLER ERROR:', err.message || err);
      throw err;
    }
  }
}
