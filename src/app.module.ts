import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PermissionsModule } from './permissions/permissions.module';
import { ModelModule } from './model/model.module';
import { RolesModule } from './roles/roles.module';
import { OktaModule } from './okta/okta.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ToolsModule } from './tools/tools.module';
import { ClassroomsModule } from './classrooms/classrooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PermissionsModule,
    ModelModule,
    RolesModule,
    OktaModule,
    UsersModule,
    AuthModule,
    ToolsModule,
    ClassroomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
