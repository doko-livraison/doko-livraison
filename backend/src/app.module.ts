import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MissionsModule } from './missions/missions.module';
import { TransportersModule } from './transporters/transporters.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { User } from './users/user.entity';
import { Mission } from './missions/mission.entity';
import { Transporter } from './transporters/transporter.entity';
import { Review } from './reviews/review.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'doko_livraison',
      entities: [User, Mission, Transporter, Review],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    MissionsModule,
    TransportersModule,
    NotificationsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
