export type JwtPayload = {
  email: string;
  sub: number; // subject 認証情報を識別するための識別子
};
