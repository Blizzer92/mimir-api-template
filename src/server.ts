import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { cards } from "./data/cards";
import { Card } from "./models/Card";
import { appState } from "./models/State";
import { shuffel, generateJwt } from "./Utils";
import { v4 as createId } from "uuid";
import crypto from "crypto";
import { users } from "./data/users";

const app = express();
const port = 8000;
const gameLength = 4;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("<div>Server is up and running</div>");
});

app.get("/api/state", (req: Request, res: Response) => {
  // send the state to client
  res.send(appState);
});

// game REST api
app.get("/api/result", (req: Request, res: Response) => {
  for (let i = 0; i < gameLength; i++) {
    if (i < cards.length) {
      appState.game.gameCards[i].back = cards[i].back;
    }
  }

  res.send(appState.game);
});

app.post("/api/game", (req: Request, res: Response) => {
  shuffel(cards);

  appState.game.gameCards = new Array<Card>();

  for (let i = 0; i < gameLength; i++) {
    if (i < cards.length) {
      appState.game.gameCards.push({ ...cards[i], back: "" });
    }
  }

  appState.game.cardIndex = 0;
  appState.game.answers = [];

  res.send(appState.game);
});

app.post("/api/answer", (req: Request, res: Response) => {
  const answer = req.body.answer;
  appState.game.answers.push(answer);
  appState.game.cardIndex++;

  res.send(appState.game.answers);
});

app.delete("/api/game", (req: Request, res: Response) => {
  appState.game = { gameCards: [], cardIndex: 0, answers: [] };
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

app.post("/api/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(username)
  const user = users.find((user) => user.name === username);
  console.log(user)

  if (user) {
    crypto.scrypt(password, user.salt, 64, async (error, derivedKey) => {
      if (!error && derivedKey.toString("hex") === user.password) {
        const accessToken = await generateJwt(username, user.roles);
        res.send({ accessToken: accessToken.toString()});
      } else {
        res.status(400).send({ error: "incorrect password" });
      }
    });
  } else {
    res.status(400).send({ error: "User does not exist" });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
