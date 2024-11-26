import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    role: string;
    sub: string;
    iat: number;
    exp: number;
  }
export const readRoleFromJwt = (accessToken: string): string | null => {
    try {
      // Decode the JWT
      const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
  
      // Return the role
      return decoded.role;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  };

export const readNameFromJwt = (accessToken: string): string | null => {
    try {
      // Decode the JWT
      const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);

      return decoded.sub;
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
        }
};