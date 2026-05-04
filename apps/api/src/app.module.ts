import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { AiModule } from './modules/ai/ai.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['../../.env', '.env'],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'short',
          ttl: 1000,
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 200,
        },
      ],
    }),
    AuthModule,
    UsersModule,
    LessonsModule,
    ExercisesModule,
    VocabularyModule,
    AiModule,
    PaymentsModule,
    LeaderboardModule,
    AdminModule,
    NotificationsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
