import express from 'express';

import { field, validators as v } from '@dwp/govuk-casa';
import { configure, Plan } from '@dwp/govuk-casa';

export default function createAppTwo(sessionStore) {
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
