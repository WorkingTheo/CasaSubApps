import express from 'express';

import { noSniff } from 'helmet';
import { configure, Plan } from '@dwp/govuk-casa';
import { waypointUrl } from '@dwp/govuk-casa';

export default function createTaskListApp(sessionStore) {
  const app = express();
  app.use(noSniff());

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
      },
      {
        waypoint: 'results',
        view: 'pages/results.njk',
      }
    ],
    plan
  });

  ancillaryRouter.use('/tasks', (req, res) => {
    const data = req.session.journeyContextList[0][1].data

    if (data.name?.name || data.surname?.surname) {
      res.locals.isNameStarted = true;
    }
    if (data.name?.name && data.surname?.surname) {
      res.locals.isNameCompleted = true;
    }

    if (data.nino?.nino || data.description?.description) {
      res.locals.isBasicInfoStarted = true;
    }
    if (data.nino?.nino && data.description?.description) {
      res.locals.isBasicInfoCompleted = true;
    }

    if (data.name?.name && data.surname?.surname && data.nino?.nino && data.description?.description) {
      res.redirect('/three/results');
      return;
    }

    res.render('pages/tasks.njk');
  });

  function makeRow(key, value, waypoint, mountUrl, editOrigin) {
    return {
      key: { text: key },
      value: { text: value },
      actions: {
        items: [{
          text: 'Change',
          visuallyHiddenText: '',
          href: waypointUrl({
            waypoint,
            mountUrl,
            edit: true,
            editOrigin: editOrigin,
          })
        }],
      },
    }
  }

  ancillaryRouter.use('/results', (req, res) => {
    console.log('got to results');
    const data = req.session.journeyContextList[0][1].data;

    const nameRow = makeRow('Name', data.name.name, 'name', '/one/', '/three/results');
    const surnameRow = makeRow('Surname', data.surname.surname, 'surname', '/one/', '/three/results');
    const ninoRow = makeRow('Nino', data.nino.nino, 'nino', '/two/', '/three/results');
    const descriptionRow = makeRow('Description', data.description.description, 'description', '/two/', '/three/results');

    res.locals.rows = [
      nameRow,
      surnameRow,
      ninoRow,
      descriptionRow
    ]

    res.render('pages/results.njk');
  })
  return mount(app);
}
