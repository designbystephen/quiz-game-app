import React from 'react';
import PropTypes from 'prop-types';
import { ScoreBoard } from './';

const Header = () => (
  <div className="board__header">
    <ScoreBoard title="Change This Game Header" />
  </div>
);

Header.propTypes = {
};

export default Header;
