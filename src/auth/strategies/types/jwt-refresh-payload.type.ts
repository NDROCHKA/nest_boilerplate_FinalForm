export type JwtRefreshPayloadType = {
  id: number;
  email: string;
  tokenUse: 'refresh';
  iat: number;
  exp: number;
};
