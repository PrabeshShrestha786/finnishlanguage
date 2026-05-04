import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('oauth.google.clientId') || 'placeholder',
      clientSecret: config.get<string>('oauth.google.clientSecret') || 'placeholder',
      callbackURL: config.get<string>('oauth.google.callbackUrl') || 'http://localhost:3001/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, name, emails, photos } = profile;
    done(null, {
      id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      photo: photos[0]?.value,
    });
  }
}
