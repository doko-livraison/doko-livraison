import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email déjà utilisé');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hash });
    await this.userRepo.save(user);

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    const { password, ...result } = user;
    return { user: result, token };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    const { password, ...result } = user;
    return { user: result, token };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) return { message: 'Si ce compte existe, un email a été envoyé.' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour
    await this.userRepo.update(user.id, {
      resetToken,
      resetTokenExpires: resetExpires,
    } as any);

    // In production: send email with resetToken
    // For dev: log the token
    console.log(`[PASSWORD RESET] Token for ${email}: ${resetToken}`);
    return { message: 'Si ce compte existe, un email a été envoyé.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.resetToken = :token', { token })
      .andWhere('user.resetTokenExpires > :now', { now: new Date() })
      .getOne();

    if (!user) throw new NotFoundException('Token invalide ou expiré');

    const hash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(user.id, {
      password: hash,
      resetToken: null,
      resetTokenExpires: null,
    } as any);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
