import express from 'express';

import { field, validators as v } from '@dwp/govuk-casa';
import { configure, Plan } from '@dwp/govuk-casa';

export default function createAppOne(sessionStore) {
  const plan = new Plan();
  plan.addSequence('name', 'surname', 'url:///three/tasks/');
  
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
