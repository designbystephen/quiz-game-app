import React from 'react';
import PropTypes from 'prop-types';
import { ScoreBoard } from './';

const Header = ({ title, ...rest }) => (
  <div className="board__header">
    <ScoreBoard title={title} {...rest} />
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
