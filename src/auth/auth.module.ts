import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/users/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv'
import { UsersApprovalRequestModule } from 'src/usersApprovalRequest/usersApprovalRequest.module';
// dotenv.config();

@Module({
  imports: [UserModule, UsersApprovalRequestModule, PassportModule, JwtModule.register({
      secret: "tyu321fghj@jfgh!piuo()lpmnjiuhb00",
      signOptions: { expiresIn: "1h"}
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
