import express from 'express';

import { noSniff } from 'helmet';
import { configure, JourneyContext, Plan } from '@dwp/govuk-casa';
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
    const journeyContext = JourneyContext.getDefaultContext(req.session);

    const nameData = journeyContext.getDataForPage('name');
    const surnameData = journeyContext.getDataForPage('surname');
    const ninoData = journeyContext.getDataForPage('nino');
    const descriptionData = journeyContext.getDataForPage('description');

    if (nameData?.name) {
      res.locals.isNameStarted = true;
    }
    if (nameData?.name && surnameData?.surname) {
      res.locals.isNameCompleted = true;
    }

    if (ninoData?.nino) {
      res.locals.isBasicInfoStarted = true;
    }
    if (ninoData?.nino && descriptionData?.description) {
      res.locals.isBasicInfoCompleted = true;
    }

    if (nameData?.name && surnameData?.surname && ninoData?.nino && descriptionData?.description) {
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
    const journeyContext = JourneyContext.getDefaultContext(req.session);

    const nameData = journeyContext.getDataForPage('name');
    const surnameData = journeyContext.getDataForPage('surname');
    const ninoData = journeyContext.getDataForPage('nino');
    const descriptionData = journeyContext.getDataForPage('description');

    const nameRow = makeRow('Name', nameData.name, 'name', '/one/', '/three/results');
    const surnameRow = makeRow('Surname', surnameData.surname, 'surname', '/one/', '/three/results');
    const ninoRow = makeRow('Nino', ninoData.nino, 'nino', '/two/', '/three/results');
    const descriptionRow = makeRow('Description', descriptionData.description, 'description', '/two/', '/three/results');

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
