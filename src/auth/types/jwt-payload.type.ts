export interface JwtPayload {
  sub: string;  // user id
  email: string;
}

export interface JwtPayloadWithRefresh extends JwtPayload {
  refreshToken: string;
}