import axios from "axios";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWKS_URL = `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co/auth/v1/jwks`;

interface JWKSKey {
  kid: string;
  x5c: string[];
  alg: string;
  kty: string;
  use: string;
}

interface JWKSResponse {
  keys: JWKSKey[];
}

interface JWTHeader {
  kid: string;
  alg: string;
  typ: string;
}

let jwksCache: JWKSResponse | null = null;

export interface SupabaseUser extends JwtPayload {
  sub: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

async function getJwks(): Promise<JWKSResponse> {
  if (!jwksCache) {
    const { data } = await axios.get<JWKSResponse>(JWKS_URL);
    jwksCache = data;
  }
  return jwksCache;
}

export async function verifySupabaseJWT(token: string): Promise<SupabaseUser> {
  const { keys } = await getJwks();
  const headerPart = token.split(".")[0];
  if (!headerPart) throw new Error("Invalid token format");
  
  const header: JWTHeader = JSON.parse(Buffer.from(headerPart, "base64").toString());
  const key = keys.find((k) => k.kid === header.kid);
  if (!key) throw new Error("Invalid key id");

  const publicKey = `-----BEGIN PUBLIC KEY-----\n${key.x5c[0]}\n-----END PUBLIC KEY-----`;
  return jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as SupabaseUser;
}
