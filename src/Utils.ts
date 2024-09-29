import { RequestHandler } from "express";
import { Card } from "./models/Card";
import * as jose from "jose";
import { accessToken } from "./models/AccessToken";
const secret = new TextEncoder().encode("myDarkSecret");

export const shuffle = (array: Card[]): void => {
  let currentIndex: number = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};

export const generateJwt = async (username: string, roles: string[]) =>
  new jose.SignJWT({ username, roles })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

export const getUsernameFromJwt = (token?: string): string => {
  if (token) {
    try {
      const jwt = jose.decodeJwt<accessToken>(token);
      return jwt.username;
    } catch (error) {
      return "";
    }
  } else return "";
};

export const getRolesFromJwt = (token?: string): string[] => {
  if (token) {
    try {
      const jwt = jose.decodeJwt<accessToken>(token);
      return jwt.roles;
    } catch (error) {
      return [];
    }
  } else return [];
};

export const authorizeByRole =
  (role: string): RequestHandler =>
  async (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
      const trimmedToken = token.replace("Bearer ", "");

      try {
        const jwt = await jose.jwtVerify<accessToken>(trimmedToken, secret);
        const userRoles = jwt.payload.roles;

        if (Array.isArray(userRoles) && userRoles.includes(role)) {
          next();
        } else {
          res.status(403).send();
        }
      } catch (e) {
        res.status(403).send();
      }
    } else {
      res.status(403).send();
    }
  };

export const authorizeByUsername =
  (): RequestHandler => async (req, res, next) => {
    const token = req.headers.authorization;
    const username = req.params.username;

    if (token) {
      const trimmedToken = token.replace("Bearer ", "");

      try {
        const jwt = await jose.jwtVerify<accessToken>(trimmedToken, secret);
        const tokenUsername = jwt.payload.username;

        if (username === tokenUsername) {
          next();
        } else {
          res.status(403).send();
        }
      } catch (e) {
        res.status(403).send();
      }
    } else {
      res.status(403).send();
    }
  };
