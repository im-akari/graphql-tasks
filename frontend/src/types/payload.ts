export type Payload = {
  email: string;
  sub: number;
  iat: number; // Token作成時刻
  exp: number; // Token有効期限
};
