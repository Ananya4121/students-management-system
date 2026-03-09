import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      username: process.env.DB_USERNAME || 'soorajjain',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'students_db',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // Only sync in dev
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    StudentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}