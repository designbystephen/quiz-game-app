import React from 'react';
import PropTypes from 'prop-types';

const Tile = ({ value, modifiers='' }) => (
  <div className={`board__tile ${modifiers}`}>
    { value }
  </div>
);

Tile.propTypes = {
  // required
  value: PropTypes.number.isRequired,

  // optional
  modifiers: PropTypes.string,
};

export default Tile;
