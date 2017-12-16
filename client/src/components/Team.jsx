import React from 'react';
import PropTypes from 'prop-types';
import { constructClassName } from '../utils/helpers';
import '../styles/components/team.scss';

const Team = ({ children, number, isActive, isLocked }) => (
  <span
    className={constructClassName(
      'team',
      `team--${number}`,
      [isActive, 'team--active'],
      [isLocked, 'team--locked'],
    )}
  >
    { children }
  </span>
);


export default Team;
