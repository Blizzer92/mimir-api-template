import express from "express";
import { Request, Response } from "express";
import bodyParser, { json } from "body-parser";
import cors from "cors";
import { cards } from "./data/cards";
import { Card } from "./models/Card";
import { appState } from "./models/State";
import {
  shuffle as shuffle,
  generateJwt,
  authorizeByRole,
  authorizeByUsername,
  getUsernameFromJwt,
  getRolesFromJwt,
} from "./Utils";
import { v4 as createId } from "uuid";
import crypto from "crypto";
import { users } from "./data/users";
import { Game } from "./models/Game";

const PORT = 8000;
const GAME_LENGTH = 4;
const app = express();

const games: Record<string, Game> = {};

app.use(cors());
app.use(bodyParser.json());
app.use("/api/card", authorizeByRole("admin"));
app.use("/api/game/:username", authorizeByUsername());
app.use("/api/result/:username", authorizeByUsername());
app.use("/api/answer/:username", authorizeByUsername());

app.get("/", (req: Request, res: Response) => {
  res.send("<div>Server is up and running</div>");
});

app.get("/api/state", async (req: Request, res: Response) => {
  // send the state to client
  const username = getUsernameFromJwt(req.headers.authorization);

  // TODO Check if this is working!
  if ("admin" in getRolesFromJwt()) {
    appState.cards = cards;
  } else {
    appState.cards = [];
  }
  appState.game = games[username];

  res.send(appState);
});

// game REST api
app.get("/api/result/:username", (req: Request, res: Response) => {
  const username = req.params.username;

  for (let i = 0; i < GAME_LENGTH; i++) {
    if (i < cards.length) {
      games[username].gameCards[i].back = cards[i].back;
    }
  }

  appState.game = games[username];
  res.send(appState.game);
});

app.post("/api/game/:username", (req: Request, res: Response) => {
  const username = req.params.username;
  let game: Game = { gameCards: [], cardIndex: 0, answers: [] };

  shuffle(cards);
  for (let i = 0; i < GAME_LENGTH; i++) {
    if (i < cards.length) {
      game.gameCards.push({ ...cards[i], back: "" });
    }
  }

  games[username] = game;
  appState.game = game;

  res.send(appState.game);
});

app.post("/api/answer/:username", (req: Request, res: Response) => {
  const username = req.params.username;
  const answer = req.body.answer;

  games[username].answers.push(answer);
  games[username].cardIndex++;
  appState.game = games[username];

  res.send(appState.game.answers);
});

app.delete("/api/game/:username", (req: Request, res: Response) => {
  const username = req.params.username;
  games[username] = { gameCards: [], cardIndex: 0, answers: [] };

  appState.game = games[username];
  res.send(appState.game);
});

// cards REST api
app.post("/api/card", (req: Request, res: Response) => {
  const card = req.body as Card;
  card.id = createId();
  appState.cards.push(card);
  res.send(card);
});

app.delete("/api/card", (req: Request, res: Response) => {
  const cardToDelete = req.body;
  const cardIndex = cards.findIndex((card) => card.id === cardToDelete.id);

  if (cardIndex !== -1) {
    cards.splice(cardIndex, 1);
    res.send(cardToDelete);
  } else {
    res.status(404).send({ error: "Card not found" });
  }
});

app.put("/api/card", (req: Request, res: Response) => {
  const updatedCard = req.body as Card;
  const cardIndex = cards.findIndex((card) => card.id === updatedCard.id);
  if (cardIndex !== -1) {
    cards[cardIndex] = updatedCard;
    res.send(updatedCard);
  } else {
    res.status(404).send({ error: "Card not found" });
  }
});

app.get(
  "/api/password-generator/:password",
  async (req: Request, res: Response) => {
    const password = req.params.password;
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (!error) {
        res.send({ password: derivedKey.toString("hex"), salt: salt });
      } else {
        res.status(400).send({ error: "Error while generating password" });
      }
    });
  }
);

app.post("/api/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.name === username);

  console.log("Login request: ", req.body);
  console.log("User details: ", user);

  if (!user) {
    console.log("Login failed: User " + username + " does not exist.");
    return res
      .status(400)
      .send({ error: "Login failed: User " + username + " does not exist." });
  }

  crypto.scrypt(password, user.salt, 64, async (error, derivedKey) => {
    if (error || derivedKey.toString("hex") !== user.password) {
      console.log(
        "Login failed for user " + username + ": incorrect password."
      );
      return res.status(400).send({
        error: "Login failed for user " + username + ": incorrect password.",
      });
    }

    const accessToken = await generateJwt(username, user.roles);

    if (!games[username])
      games[username] = { gameCards: [], cardIndex: 0, answers: [] };

    console.log("Login successful for user " + username);
    res.send({
      accessToken: accessToken.toString(),
      username: username,
      roles: user.roles,
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

//TODO REMOVE
app.get("/api/gamesrecord", (req: Request, res: Response) => {
  res.send(games);
});
