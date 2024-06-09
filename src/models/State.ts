import { cards } from "../data/cards";
import { Card } from "./Card";
import { Game } from "./Game";

export interface AppState {
    cards: Card[],
    game: Game
}

export const appState: AppState = { cards: cards, game: { gameCards: [], cardIndex: 0, answers: [] } };