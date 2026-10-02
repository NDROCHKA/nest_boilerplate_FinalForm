export type AuthDuration = `${number}${'s' | 'm' | 'h' | 'd'}`;

export type AuthConfig = {
  secret: string;
  expires: AuthDuration;
  refreshSecret: string;
  refreshExpires: AuthDuration;
  issuer: string;
  audience: string;
};
