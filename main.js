import express from 'express';
import { MemoryStore } from 'express-session';

import { field, validators as v } from '@dwp/govuk-casa';
import { configure, Plan } from '@dwp/govuk-casa';

import createAppOne from './createAppOne.js';
import createAppTwo from './createAppTwo.js';
import createTaskListApp from './createTaskListApp.js';

const sessionStore = new MemoryStore();

const app1 = createAppOne(sessionStore);
const app2 = createAppTwo(sessionStore);
const taskListApp = createTaskListApp(sessionStore);

const parent = express();
parent.use('/one/', app1);
parent.use('/two/', app2);
parent.use('/three/', taskListApp);

parent.listen(3000, () => {
    console.log('started');
});
