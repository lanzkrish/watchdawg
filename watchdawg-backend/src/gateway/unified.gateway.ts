/** @format */

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

/* ============================== */
/* 🧠 TYPES                       */
/* ============================== */

type ActivityCategory = 'productive' | 'neutral' | 'distracting';
type ActivityStatus = 'active' | 'idle' | 'away';

type ActivityPayload = {
  userId: string;
  organizationId: string;

  name: string;

  app: string;
  title: string;
  platform: string;

  category: ActivityCategory;
  status: ActivityStatus;

  duration: number;

  background?: {
    app: string;
    type: string;
    duration: number;
  } | null;

  timestamp: number;
};

type JoinEmployeePayload = {
  orgId: string;
  userId?: string;
};

/* ============================== */
/* 🚀 GATEWAY                     */
/* ============================== */

@WebSocketGateway({
  cors: { origin: '*' },
})
export class UnifiedGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  /* ============================== */
  /* 🔌 CONNECTION HANDLING         */
  /* ============================== */

  handleConnection(client: Socket) {
    try {
      console.log(`🟢 [WS] Connected: ${client.id}`);

      // 🔐 optional: token validation (future)
      const token = client.handshake.auth?.token;
      if (!token) {
        console.warn(`⚠️ No token provided: ${client.id}`);
      }
    } catch (err) {
      console.error('❌ Connection error:', err);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`🔴 [WS] Disconnected: ${client.id}`);
  }

  /* ============================== */
  /* 👑 ADMIN JOIN                  */
  /* ============================== */

  @SubscribeMessage('join_admin')
  handleAdminJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() orgId: string,
  ) {
    if (!orgId) {
      client.emit('error', { message: 'Missing orgId' });
      return;
    }

    const room = this.adminRoom(orgId);

    client.join(room);

    console.log(`👑 Admin joined → ${room}`);

    // ✅ ACK (important for frontend)
    client.emit('joined_admin', { orgId });
  }

  /* ============================== */
  /* 👤 EMPLOYEE JOIN               */
  /* ============================== */

  @SubscribeMessage('join_employee')
  handleEmployeeJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinEmployeePayload,
  ) {
    if (!payload?.orgId) {
      client.emit('error', { message: 'Missing orgId' });
      return;
    }

    const orgRoom = this.orgRoom(payload.orgId);

    client.join(orgRoom);

    if (payload.userId) {
      client.join(this.userRoom(payload.userId));
    }

    console.log(
      `👤 Employee joined → ${orgRoom}${payload.userId ? ` | user:${payload.userId}` : ''}`,
    );

    // ✅ ACK
    client.emit('joined_employee', {
      orgId: payload.orgId,
      userId: payload.userId,
    });
  }

  /* ============================== */
  /* 📡 CORE DISPATCH               */
  /* ============================== */

  sendActivity(data: ActivityPayload) {
    try {
      /* ============================== */
      /* 🔒 VALIDATION                  */
      /* ============================== */

      if (!data?.organizationId || !data?.userId) {
        console.warn('⚠️ Invalid activity payload');
        return;
      }

      const orgRoom = this.orgRoom(data.organizationId);
      const adminRoom = this.adminRoom(data.organizationId);
      const userRoom = this.userRoom(data.userId);

      /* ============================== */
      /* 🧾 DEBUG (SAFE LOG)            */
      /* ============================== */

      console.log(`[WS] ${data.organizationId} | ${data.userId} | ${data.app}`);

      /* ============================== */
      /* 👥 EMPLOYEE BROADCAST          */
      /* ============================== */

      this.server.to(orgRoom).emit('employee:activity', data);

      /* ============================== */
      /* 👤 PERSONAL STREAM             */
      /* ============================== */

      this.server.to(userRoom).emit('employee:self', data);

      /* ============================== */
      /* 👑 ADMIN STREAM                */
      /* ============================== */

      this.server.to(adminRoom).emit('admin:update', data);

      /* ============================== */
      /* 📜 ACTIVITY FEED               */
      /* ============================== */

      this.server.to(adminRoom).emit('activity_feed', {
        userId: data.userId,
        name: data.name,
        message: `${data.title || data.app} (${data.status})`,
        time: new Date(data.timestamp).toISOString(),
      });
    } catch (err) {
      console.error('❌ sendActivity error:', err);
    }
  }

  /* ============================== */
  /* 🧠 ROOM HELPERS               */
  /* ============================== */

  private orgRoom(orgId: string) {
    return `org:${orgId}`;
  }

  private adminRoom(orgId: string) {
    return `admin:${orgId}`;
  }

  private userRoom(userId: string) {
    return `user:${userId}`;
  }
}
