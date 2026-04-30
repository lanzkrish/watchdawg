// /** @format */

// import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { DatabaseService } from '../database/database.service';
// import { ActivityGateway } from './activity.gateway';

// @Injectable()
// export class ActivityService {
//   constructor(
//     private db: DatabaseService,
//     private gateway: ActivityGateway,
//   ) {}

//   /* ================================================= */
//   /* 📊 TRACK ACTIVITY                                 */
//   /* ================================================= */

//   async track(userId: string, body: any) {
//     await this.db.query(
//       `INSERT INTO activity (user_id, is_active, productivity_score, duration)
//      VALUES ($1, $2, $3, $4)`,
//       [userId, body.isActive, body.productivityScore, body.duration],
//     );

//     /* 🔥 LIVE ACTIVITY */
//     this.gateway.sendUpdate({
//       userId,
//       isActive: body.isActive,
//     });

//     /* 🔥 DASHBOARD STATS UPDATE */
//     const stats = await this.getLiveStats(userId);

//     this.gateway.sendDashboardUpdate(stats);

//     return { success: true };
//   }

//   async getLiveStats(userId: string) {
//     const result = await this.db.query(`
//     SELECT
//       COUNT(*) FILTER (WHERE NOW() - last_seen < INTERVAL '30 seconds') as active_users,
//       AVG(productivity_score) as avg_productivity
//     FROM users u
//     LEFT JOIN activity a ON u.id = a.user_id
//   `);

//     return {
//       activeUsers: Number(result.rows[0].active_users),
//       avgProductivity: Number(result.rows[0].avg_productivity) || 0,
//     };
//   }

//   /* ================================================= */
//   /* 💓 HEARTBEAT                                      */
//   /* ================================================= */

//   async heartbeat(userId: string) {
//     await this.db.query(`UPDATE users SET last_seen = NOW() WHERE id = $1`, [
//       userId,
//     ]);

//     /* 🔥 ONLINE STATUS */
//     this.gateway.sendUserStatus({
//       userId,
//       status: 'online',
//     });

//     return { success: true };
//   }

//   /* ================================================= */
//   /* ⏰ AUTO OFFLINE DETECTION                         */
//   /* ================================================= */

//   @Cron('*/10 * * * * *') // every 10 seconds
//   async checkInactiveUsers() {
//     const result = await this.db.query(`
//       SELECT id FROM users
//       WHERE last_seen IS NOT NULL
//       AND NOW() - last_seen > INTERVAL '30 seconds'
//     `);

//     for (const user of result.rows) {
//       this.gateway.sendUserStatus({
//         userId: user.id,
//         status: 'offline',
//       });
//     }
//   }
// }
