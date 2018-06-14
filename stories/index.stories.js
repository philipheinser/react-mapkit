import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  select,
  color,
  boolean,
  object,
} from '@storybook/addon-knobs/react';
import { linkTo } from '@storybook/addon-links';
import { withNotes } from '@storybook/addon-notes';

import readme from '../readme.md';
import Map, { Wrapper, MapEventProps } from '../index';

const authToken =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkY1UzdXWk01NFoifQ.eyJpc3MiOiI2QlM1OVNDOTQyIiwiaWF0IjoxNTI5MDA3NzQyLjI0NSwiZXhwIjoxNTI5MDA5NTQyLjI0NX0.o-SQdLy8SZSzD7fJaW0Ftic-V0H3Fh72vvAwssT1sExEPTs34O4Xw9jlZ0X6NRTErVtoD68LLQ_K7MuY1rHTnw';

storiesOf('Welcome', module).add('to Storybook', () => (
  <div dangerouslySetInnerHTML={{ __html: readme }} />
));

const mapStories = storiesOf('Map', module);

mapStories.addDecorator(withKnobs);

mapStories
  .add('default', () => (
    <Wrapper
      authorizationCallback={done => {
        done(authToken);
      }}
    >
      <Map
        center={object('center', {
          latitude: 37.33182,
          longitude: -122.03118,
        })}
        mapType={select('mapType', {
          standard: 'standard',
          hybrid: 'hybrid',
          satellite: 'satellite',
        })}
        tintColor={color('tintColor')}
        showsZoomControl={boolean('showsZoomControl', true)}
        showsScale={select('showsScale', {
          adaptive: 'adaptive',
          visible: 'visible',
          hidden: 'hidden',
        })}
        showsCompass={select('showsCompass', {
          adaptive: 'adaptive',
          visible: 'visible',
          hidden: 'hidden',
        })}
        showsUserLocationControl={boolean('showsUserLocationControl', true)}
        isZoomEnabled={boolean('isZoomEnabled', true)}
        isRotationEnabled={boolean('isRotationEnabled', true)}
        isScrollEnabled={boolean('isScrollEnabled', true)}
      />
    </Wrapper>
  ))
  .add('events', () => (
    <Wrapper
      authorizationCallback={done => {
        done(authToken);
      }}
    >
      <Map
        {...Object.values(MapEventProps).reduce((result, current) => {
          result[current] = action(current);
          return result;
        }, {})}
      />
    </Wrapper>
  ));
