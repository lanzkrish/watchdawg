/** @format */

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { UsersService } from '../users/users.service';
import { UnifiedGateway } from './unified.gateway';

/* ============================== */
/* 🧠 TYPES                       */
/* ============================== */

type ActivityCategory = 'productive' | 'neutral' | 'distracting';
type ActivityStatus = 'active' | 'idle' | 'away';

type BackgroundActivity = {
  app: string;
  type: string;
  duration: number;
};

type AgentPayload = {
  userId: string;
  organizationId: string;

  app: string;
  title?: string;
  platform?: string;
  category?: string;

  status?: ActivityStatus;
  duration?: number;

  background?: BackgroundActivity | null;
  timestamp?: number;
};

type UserEntity = {
  id: string;
  name?: string;
  full_name?: string;
  email?: string;
};

/* ============================== */
/* 🧠 HELPERS                     */
/* ============================== */

function normalizeCategory(category?: string): ActivityCategory {
  if (category === 'productive') return 'productive';
  if (category === 'distracting') return 'distracting';
  return 'neutral';
}

function normalizeStatus(status?: string): ActivityStatus {
  if (status === 'active') return 'active';
  if (status === 'idle') return 'idle';
  return 'away';
}

/* ============================== */
/* 🚀 GATEWAY                     */
/* ============================== */

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ActivityGateway {
  private userCache: Record<string, UserEntity> = {};

  constructor(
    private readonly unifiedGateway: UnifiedGateway,
    private readonly usersService: UsersService,
  ) {}

  /* ============================== */
  /* 🚀 AGENT ACTIVITY              */
  /* ============================== */

  @SubscribeMessage('agent_activity')
  async handleAgentActivity(@MessageBody() data: AgentPayload) {
    try {
      /* ============================== */
      /* 🔒 VALIDATION                  */
      /* ============================== */

      if (!data?.userId || !data.organizationId) {
        console.warn('❌ Invalid payload');
        return;
      }

      /* ============================== */
      /* 👤 USER CACHE                 */
      /* ============================== */

      let user = this.userCache[data.userId];

      if (!user) {
        try {
          user = await this.usersService.findById(data.userId);
          if (user) this.userCache[data.userId] = user;
        } catch (err) {
          console.error('❌ User fetch failed:', err);
        }
      }

      /* ============================== */
      /* 🧠 NORMALIZATION               */
      /* ============================== */

      const app: string = data.app || 'Unknown';

      const platform: string = this.cleanPlatform(
        data.platform || data.app || 'Unknown',
      );

      let title: string = this.extractTitle(app, data.title || app);

      let category: ActivityCategory = normalizeCategory(data.category);
      let status: ActivityStatus = normalizeStatus(data.status);

      /* ============================== */
      /* 🌐 EXTENSION ENRICHMENT        */
      /* ============================== */

      const ext = (globalThis as any)?.latestExtensionData;

      if (
        ext &&
        ext.userId === data.userId &&
        Date.now() - ext.timestamp < 5000 &&
        this.isBrowser(app)
      ) {
        if (ext.title) title = ext.title;
        if (ext.category) category = normalizeCategory(ext.category);
      }

      /* ============================== */
      /* 🎵 MUSIC FIX                   */
      /* ============================== */

      if (platform.toLowerCase().includes('spotify')) {
        title = 'Music';
      }

      /* ============================== */
      /* 🎵 BACKGROUND                  */
      /* ============================== */

      let background: BackgroundActivity | null = null;

      if (data.background?.duration && data.background.duration > 0) {
        background = {
          app: this.cleanPlatform(data.background.app || 'Spotify'),
          type: data.background.type || 'music',
          duration: Number(data.background.duration),
        };
      }

      /* ============================== */
      /* 📦 FINAL OBJECT                */
      /* ============================== */

      const normalized = {
        userId: data.userId,
        organizationId: data.organizationId,

        name:
          user?.full_name?.trim() ||
          user?.name?.trim() ||
          user?.email ||
          `User-${data.userId.slice(0, 4)}`,

        app,
        platform,
        title,

        category,
        status,
        duration: Number(data.duration ?? 0),

        background,

        timestamp: data.timestamp ?? Date.now(),
      };

      /* ============================== */
      /* 📡 DEBUG                      */
      /* ============================== */

      console.log(
        `📡 [ACTIVITY] ${normalized.userId} → ${normalized.app} (${normalized.status})`,
      );

      /* ============================== */
      /* 🚀 DISPATCH                   */
      /* ============================== */

      this.unifiedGateway.sendActivity(normalized);
    } catch (err) {
      console.error('❌ Activity error:', err);
    }
  }

  /* ============================== */
  /* 🧠 HELPERS                     */
  /* ============================== */

  private extractTitle(app: string, title: string): string {
    const clean = (title || '').trim();

    if (this.isBrowser(app)) return clean.split(' - ')[0];
    if (app.toLowerCase().includes('code')) return clean.split(' - ')[0];

    return clean.length > 80 ? clean.slice(0, 80) + '...' : clean;
  }

  private isBrowser(app: string): boolean {
    const n = app?.toLowerCase() || '';
    return n.includes('chrome') || n.includes('edge') || n.includes('firefox');
  }

  private cleanPlatform(platform: string): string {
    return (platform || '')
      .replace('.exe', '')
      .replace('localhost', 'Local App')
      .trim();
  }
}
