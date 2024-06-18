import express from 'express'
import { Request, Response } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import { cards } from './data/cards'
import { Card } from './models/Card'
import { appState } from './models/State';
import { shuffel } from './Utils';

const app = express()
const port = 8000

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
  res.send('<div>Server is up and running</div>')
})

app.get('/api/state', (req: Request, res: Response) => {
  // send the state to client  
  res.send(appState);
})

// game REST api
app.get('/api/result', (req: Request, res: Response) => {

  appState.game.gameCards[0].back = cards[0].back;
  appState.game.gameCards[1].back = cards[1].back;
  appState.game.gameCards[2].back = cards[2].back;

  res.send(appState.game);
})

app.post('/api/game', (req: Request, res: Response) => {
  shuffel(cards);

  let card1 = structuredClone(cards[0]);
  let card2 = structuredClone(cards[1]);
  let card3 = structuredClone(cards[2]);

  card1.back = "";
  card2.back = "";
  card3.back = "";


  // generate a new game
  appState.game.gameCards = new Array<Card>();
  appState.game.gameCards.push(card1);
  appState.game.gameCards.push(card2);
  appState.game.gameCards.push(card3);
  appState.game.cardIndex = 0;
  appState.game.answers = [];
  
  res.send(appState.game);
})

app.post('/api/answer', (req: Request, res: Response) => {
  const answer = req.body.answer;
  appState.game.answers.push(answer);
  appState.game.cardIndex++;

  res.send(appState.game.answers)
})

app.delete('/api/game', (req: Request, res: Response) => {
  appState.game = { gameCards: [], cardIndex: 0, answers: [] };    
  res.send(appState.game)
})

// cards REST api
app.post('/api/card', (req: Request, res: Response) => {
  const card = req.body as Card;  
  appState.cards.push(card);
  res.send(card)
})

app.delete('/api/card', (req: Request, res: Response) => {
  const cardToDelete = req.body;  
  const cardIndex = cards.findIndex(card => card.id === cardToDelete.id);

  if (cardIndex !== -1) {
    cards.splice(cardIndex, 1);
    res.send(cardToDelete);
  } else {
    res.status(404).send({ error: 'Card not found' });
  }
});

app.patch('/api/card', (req: Request, res: Response) => {
  const updatedCard = req.body as Card;
  const cardIndex = cards.findIndex(card => card.id === updatedCard.id);
  if (cardIndex !== -1) {
    cards[cardIndex] = updatedCard;
    res.send(updatedCard);
  } else {
    res.status(404).send({ error: 'Card not found' });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})

