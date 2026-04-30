/** @format */

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
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

  private async findUserById(userId: string) {
    const res = await this.db.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);
    return res.rows[0];
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private generateToken(user: any) {
    return this.jwt.sign({
      id: user.id,
      role: user.role,
      organizationId: user.organization_id,
    });
  }

  private async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  /* ================= REGISTER ================= */

  async registerSuperAdmin(data: any) {
    const { fullName, email, password } = data;

    if (await this.findUserByEmail(email)) {
      throw new BadRequestException('Email already exists');
    }

    const hashed = await this.hashPassword(password);
    const userId = uuid();

    const res = await this.db.query(
      `
      INSERT INTO users (
        id, full_name, email, password,
        role, organization_id, is_first_login
      )
      VALUES ($1,$2,$3,$4,'superadmin',NULL,false)
      RETURNING id, full_name, email, role
      `,
      [userId, fullName, email, hashed],
    );

    return {
      message: 'Super admin created successfully',
      user: res.rows[0],
    };
  }

  async registerAdmin(data: any) {
    const { fullName, email, password, companyName, industry, size } = data;

    if (await this.findUserByEmail(email)) {
      throw new BadRequestException('Email already exists');
    }

    const hashed = await this.hashPassword(password);

    const orgId = uuid();
    const adminId = uuid();

    await this.db.query(
      `INSERT INTO organization (id, name, industry, size, admin_id)
       VALUES ($1,$2,$3,$4,$5)`,
      [orgId, companyName, industry, size, adminId],
    );

    await this.db.query(
      `
      INSERT INTO users (
        id, full_name, email, password,
        role, organization_id, is_first_login
      )
      VALUES ($1,$2,$3,$4,'admin',$5,false)
      `,
      [adminId, fullName, email, hashed, orgId],
    );

    return { message: 'Admin created successfully' };
  }

  /* ================= WEBSITE LOGIN ================= */

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.full_name,
        role: user.role,
        organizationId: user.organization_id,
      },
    };
  }

  /* ================= RESET PASSWORD (ADMIN) ================= */

  async resetPassword(userId: string, newPassword: string) {
    const user = await this.findUserById(userId);

    if (!user) throw new BadRequestException('User not found');

    const hashed = await this.hashPassword(newPassword);

    await this.db.query(
      `UPDATE users SET password=$1, is_first_login=true WHERE id=$2`,
      [hashed, userId],
    );

    return { message: 'Password reset successfully' };
  }
}
