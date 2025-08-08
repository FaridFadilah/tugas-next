import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    name: string;
  };
}

export async function authenticateToken(req: AuthenticatedRequest, res: NextApiResponse, next: () => void) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    req.user = payload as any;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Wrapper untuk API routes yang memerlukan authentication
export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => void) {
  return (req: AuthenticatedRequest, res: NextApiResponse) => {
    authenticateToken(req, res, () => {
      handler(req, res);
    });
  };
}
