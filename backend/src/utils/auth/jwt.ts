import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};
