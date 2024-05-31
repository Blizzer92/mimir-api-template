import { randomUUID } from 'crypto';
import { Card } from '../models/Card';

export let cards: Card[] = [
    { id: randomUUID(), front: 'Vergangenheit', back: 'Past' },
    { id: randomUUID(), front: 'Gegenwart', back: 'Present' },
    { id: randomUUID(), front: 'Zukunft', back: 'Future' },
    { id: randomUUID(), front: 'Time', back: 'Zeit' },
    { id: randomUUID(), front: 'Hour', back: 'Stunde' },
    { id: randomUUID(), front: 'Minute', back: 'Minute' },
    { id: randomUUID(), front: 'Affe', back: 'Ape' },
];


