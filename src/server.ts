import express from 'express'
import{ Request, Response } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import { cards } from './data/cards'
import { Card } from './models/Card'


const app = express()
const port = 3003

app.use(cors())

app.use(bodyParser.json())

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

