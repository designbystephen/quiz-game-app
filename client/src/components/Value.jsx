import React from 'react';
import PropTypes from 'prop-types';
import { constructClassName } from '../utils/helpers';
import '../styles/components/value.scss';

const Value = ({ children, isLocked }) => (
  <span
    className={constructClassName(
      'value',
      [isLocked, 'value--locked'],
    )}
  >
    { children }
  </span>
);


export default Value;
