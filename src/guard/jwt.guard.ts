import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { constants } from 'src/constants/constants';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) throw new UnauthorizedException('Token is invalid or empty')
        
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: constants.secret
                }
            );

            console.log(payload);
            
            request['user'] = payload;

        } catch {
            throw new UnauthorizedException()
        }

        return true;
    }

    private extractToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined
    }    
}