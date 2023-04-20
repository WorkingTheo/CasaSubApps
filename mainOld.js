import express from 'express';
import { MemoryStore } from 'express-session';
import application from './subApp.js';

import { field, validators as v } from '@dwp/govuk-casa';
import { configure, Plan } from '@dwp/govuk-casa';

function createAppOne(sessionStore) {
    const plan = new Plan();
    plan.addSequence('name', 'surname', 'url:///three/tasks/');
    
    //plan.addSequence('name', 'url:///three/tasks/');
    //plan.addSequence('name', '/two/nino/');

    // plan.addSequence('name', 'url:///two/nino/');
    const { mount } = configure({
        session: {
            name: 'myappsessionid', // session cookie name 
            secret: 'secret',       // secret used to sign cookie
            ttl: 3600,              // (seconds)
            secure: false,
            store: sessionStore
        },
        views: ['views'],
        pages: [
            {
                waypoint: 'name',
                view: 'pages/name.njk',
                fields: [
                    field('name').validators([
                      v.required.make({
                        errorMsg: {
                          summary: 'Enter your name'
                        }
                      })
                    ])
                  ]
            },
            {
                waypoint: 'surname',
                view: 'pages/surname.njk',
                fields: [
                    field('surname').validators([
                      v.required.make({
                        errorMsg: {
                          summary: 'Enter your surname'
                        }
                      })
                    ])
                  ]
            }
        ],
        plan
    });
    return mount(express());
}

function createAppTwo(sessionStore) {
    const plan = new Plan();
    plan.addSequence('nino', 'description', 'url:///three/tasks/');
    const { mount } = configure({
        session: {
            name: 'myappsessionid', // session cookie name 
            secret: 'secret',       // secret used to sign cookie
            ttl: 3600,              // (seconds)
            secure: false,
            store: sessionStore
        },
        views: ['views'],
        pages: [
            {
                waypoint: 'nino',
                view: 'pages/nino.njk',
                fields: [
                    field('nino').validators([
                      v.required.make({
                        errorMsg: {
                          summary: 'Enter your NINo'
                        }
                      })
                    ])
                  ]
            },
            {
                waypoint: 'description',
                view: 'pages/description.njk',
                fields: [
                    field('description').validators([
                      v.required.make({
                        errorMsg: {
                          summary: 'Describe your issue'
                        }
                      })
                    ])
                  ]
            }
        ],
        plan
    });
    return mount(express());
}

function createAppThree(sessionStore) {
    const plan = new Plan();
    const { mount, ancillaryRouter } = configure({
        views: ['views'],
        session: {
            name: 'myappsessionid', // session cookie name 
            secret: 'secret',       // secret used to sign cookie
            ttl: 3600,              // (seconds)
            secure: false,
            store: sessionStore
        },
        pages: [
            {
                waypoint: 'tasks',
                view: 'pages/tasks.njk'
            }
        ],
        plan
    });

    ancillaryRouter.use('/tasks', (req, res) => {
        res.render('pages/tasks.njk');
    });
    return mount(express());
}

const sessionStore = new MemoryStore();

const app1 = createAppOne(sessionStore);
const app2 = createAppTwo(sessionStore);
const app3 = createAppThree(sessionStore);

const parent = express();
parent.use('/one/', app1);
parent.use('/two/', app2);
parent.use('/three/', app3);

parent.listen(3000, () => {
    console.log('started');
});
