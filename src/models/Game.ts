import { Card } from "./Card"

export interface Game {
  gameCards: Card[]
  cardIndex: number
  answers: string[]
}