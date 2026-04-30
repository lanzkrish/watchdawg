/** @format */

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AgentAuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
  ) {}

  /* ================= HELPERS ================= */

  private async findUserByEmail(email: string) {
    const res = await this.db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return res.rows[0];
  }

  private async findUserById(id: string) {
    const res = await this.db.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return res.rows[0];
  }

  private generateToken(user: any) {
    return this.jwt.sign({
      id: user.id,
      role: user.role,
      organizationId: user.organization_id,
    });
  }

  /* ================= LOGIN ================= */

  async agentLogin(email: string, password: string) {
    const user = await this.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    if (user.role !== 'employee') {
      throw new UnauthorizedException('Only employees allowed');
    }

    if (!user.is_active || !user.access_enabled) {
      throw new UnauthorizedException('Access denied');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.full_name,
        organizationId: user.organization_id,
        firstLogin: user.is_first_login,
      },
    };
  }

  /* ================= CHANGE PASSWORD ================= */

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.findUserById(userId);

    if (!user) throw new BadRequestException('User not found');

    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Incorrect current password');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.db.query(
      `UPDATE users SET password=$1, is_first_login=false WHERE id=$2`,
      [hashed, userId],
    );

    return { message: 'Password updated successfully' };
  }

  /* ================= FORGOT PASSWORD ================= */

  async forgotPassword(email: string) {
    const user = await this.findUserByEmail(email);

    if (!user) throw new BadRequestException('User not found');

    if (user.is_first_login) {
      throw new BadRequestException('Use initial password setup');
    }

    if (user.role !== 'employee') {
      throw new UnauthorizedException('Not allowed');
    }

    return {
      message: 'Reset instructions sent (mock)',
    };
  }
}
