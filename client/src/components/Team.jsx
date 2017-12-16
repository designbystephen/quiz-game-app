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
    { number === '2' && isActive && <i className="fas fa-fw fa-star" />}
    { children }
    { number === '1' && isActive && <i className="fas fa-fw fa-star" />}
  </span>
);


export default Team;
