import type { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/auth/jwt"
import { ERRORS } from "../utils/constants/errors"

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
        role: string
      }
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: ERRORS.UNAUTHORIZED })
  }

  const payload = verifyAccessToken(token)
  if (typeof payload === 'string') {
    return res.status(401).json({ error: ERRORS.INVALID_TOKEN })
  }

  req.user = payload as { userId: string; email: string; role: string }
  next()
}

export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: ERRORS.FORBIDDEN })
    }
    next()
  }
}
