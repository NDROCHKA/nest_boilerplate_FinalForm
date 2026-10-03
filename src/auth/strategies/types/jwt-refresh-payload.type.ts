export type JwtRefreshPayloadType = {
  id: number;
  email: string;
  tokenUse: 'refresh';
  tokenVersion?: number;
  iat: number;
  exp: number;
};
