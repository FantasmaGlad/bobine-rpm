import assert from 'node:assert/strict';
import {newGame,step} from './game.mjs';
const c=newGame('catch',()=>.5);c.y=269;step(c,.1);assert.equal(c.score,1);c.lane=0;c.y=269;step(c,.1);assert.equal(c.lives,2);
const b=newGame('breakout');b.ballY=330;step(b,.01);assert.equal(b.lives,2);b.lives=1;b.ballY=330;step(b,.01);assert.equal(b.ended,true);
console.log('Règles et fin de partie vérifiées.');
