import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USER,
      entities: ['dist/**/*.entity.js'],
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
