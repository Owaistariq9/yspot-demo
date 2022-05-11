import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Constants } from "src/core/constants/constants";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({ 
            usernameField: Constants.email,
            passwordField: Constants.password
          });
    }
    async validate(email:string,password:string):Promise<any>{
        const user = await this.authService.validateUser(email,password)
        if(!user){
            throw new UnauthorizedException("Incorrent email or password");
        }
        return user;
    }
}