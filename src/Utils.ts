import { RequestHandler } from "express";
import { Card } from "./models/Card";
import * as jose from "jose";
const secret = new TextEncoder().encode("myDarkSecret");

export const shuffel = (array: Card[]): void => {
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

export const checkJwt = async (token: string) => {
  try {
    const jwt = await jose.jwtVerify(token, secret);
    console.log(jwt.payload.username);
    console.log(jwt.payload.role);
    return true;
  } catch (e) {
    return false;
  }
};

export const authorize =
  (role: string): RequestHandler =>
  async (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
      const trimmedToken = token.replace("Bearer ", "");

      try {
        //TODO refactor: type jwtVerify
        const jwt = await jose.jwtVerify(trimmedToken, secret);
        const userRoles = jwt.payload["roles"] as string[]; // Type assertion

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