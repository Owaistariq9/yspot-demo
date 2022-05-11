import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService){}

    async validateUser(email:string, password:string):Promise<any>{
        const user = await this.usersService.getUserByEmail(email);
        const encryptedPassword = await this.usersService.encryptPassword(password);
        if(user && user.password === encryptedPassword){
            const {password, ...rest} = user;
            return rest
        }
        return null
    }

    async login(user:any){
        const userObj = {
            _id: user._id,
            createdAt:new Date().getTime(),
            expiryTime:process.env.TOKEN_EXPIRY,
            userClaims: {
                userType: user.userType
            }
        };
        return {
            token: this.jwtService.sign(userObj),
            userType: user.userType,
            user: user
        }
    }

}
