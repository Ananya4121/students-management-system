import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'soorajjain',
      password: '',
      database: 'students_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    StudentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}