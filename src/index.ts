import 'dotenv/config';

import { Vibey } from './handlers/client';
const bot: Vibey = new Vibey();

bot.startClient().catch(error => console.error(error))
