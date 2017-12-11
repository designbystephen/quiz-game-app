import React from 'react';
import PropTypes from 'prop-types';
import { ScoreBoard } from './';

const Header = ({ title }) => (
  <div className="board__header">
    <ScoreBoard title={title} />
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
