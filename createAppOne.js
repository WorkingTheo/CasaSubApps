import express from 'express';

import { field, validators as v } from '@dwp/govuk-casa';
import { configure, Plan } from '@dwp/govuk-casa';

export default function createAppOne(sessionStore) {
  const plan = new Plan();
  plan.addSequence('name', 'know-surname',);
  plan.addSkippables('surname');

  plan.setRoute('know-surname', 'surname', (r,c) => c.getDataForPage('know-surname').know === 'yes');
  plan.setRoute('know-surname', 'url:///three/tasks/', (r,c) => c.getDataForPage('know-surname').know === 'no');

  plan.setRoute('surname', 'url:///three/tasks/');

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
            waypoint: 'know-surname',
            view: 'pages/know-surname.njk',
            fields: [
              field('know').validators([
                v.required.make({
                  errorMsg: {
                    summary: 'Tell us whether you know surname'
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
