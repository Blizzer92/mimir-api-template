import express from 'express'
import { Request, Response } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import { cards } from './data/cards'
import { Card } from './models/Card'
import { Game } from './models/Game';

const game = new Game();

const app = express()
const port = 8000

app.use(cors())

app.use(bodyParser.json())

app.get('/game/load', (req: Request, res: Response) => {
  res.send(game)
})

app.get('/game/new', (req: Request, res: Response) => {
  game.gameCards = new Array<Card>();
  game.gameCards.push(cards[0]);
  game.gameCards.push(cards[1]);
  game.gameCards.push(cards[2]);
  res.send(game)
})

app.get('/cards', (req: Request, res: Response) => {
  res.send(cards)
})

app.post('/add-card', (req: Request, res: Response) => {
  const card = req.body;
  console.log(JSON.stringify(card));
  cards.push(card);
  res.send(card)
})

app.delete('/delete-card', (req: Request, res: Response) => {
  const cardToDelete = req.body;
  console.log(JSON.stringify(cardToDelete));
  console.log('card deleted');

  const cardIndex = cards.findIndex(card => card.id === cardToDelete.id);
  if (cardIndex !== -1) {
    cards.splice(cardIndex, 1);
    res.send(cardToDelete);
  } else {
    res.status(404).send({ error: 'Card not found' });
  }
});

app.patch('/update-card', (req: Request, res: Response) => {
  const updatedCard = req.body as Card;
  console.log(JSON.stringify(updatedCard));
  console.log('card updated');

  const cardIndex = cards.findIndex(card => card.id === updatedCard.id);
  if (cardIndex !== -1) {
    cards[cardIndex] = updatedCard;
    res.send(updatedCard);
  } else {
    res.status(404).send({ error: 'Card not found' });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

