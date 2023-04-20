import util from 'util';
import { waypointUrl } from '@dwp/govuk-casa';

const rowFactory = (t, mountUrl) => (waypoint, fieldName, value, key = `${waypoint}`) => ({
  key: { text: t(key) },
  value: { text: value },
  actions: {
    items: [{
      text: 'Change',
      visuallyHiddenText: '',
      href: waypointUrl({
        waypoint,
        mountUrl,
        edit: true,
        editOrigin: `${mountUrl}results`,
      }) + `#f-${fieldName}`,
    }],
  },
});

export default [{
  hook: 'prerender',
  middleware: (req, res, next) => {
    console.log('going into results');

    const data = req.casa.journeyContext.data;
    const row = rowFactory(req.t, `${req.baseUrl}/`);

    console.log(util.inspect(data, {showHidden: false, depth: null, colors: true}))

    res.locals.rows = [
      row('url:///one/name/', 'name', data.name.name),
      row('url:///one/surname/', 'surname', data.surname.surname),
      // row('nino', 'nino', data.nino.nino),
      // row('description', 'description', data.description.description)
    ];
    next();
  }
}]