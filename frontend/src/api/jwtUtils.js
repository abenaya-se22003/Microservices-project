import { jwtDecode } from 'jwt-decode';

/**
 * Decode the JWT payload without verifying the signature.
 * (Signature verification is done server-side by the auth-service.)
 *
 * @param {string} token - The JWT token string
 * @returns {object|null} The decoded payload, or null if invalid
 */
export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch (e) {
    console.error('Failed to decode JWT token:', e);
    return null;
  }
}

/**
 * Check whether a JWT token has expired.
 *
 * @param {string} token - The JWT token string
 * @returns {boolean} True if the token is expired or invalid
 */
export function isTokenExpired(token) {
  var decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
}

/**
 * Extract user information from a JWT token.
 *
 * @param {string} token - The JWT token string
 * @returns {object|null} User object { userId, fullName, email, role } or null
 */
export function getUserFromToken(token) {
  var decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }
  return {
    userId: decoded.userId,
    fullName: decoded.fullName,
    email: decoded.email || decoded.sub,
    role: decoded.role,
  };
}
