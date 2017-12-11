import React from 'react';
import PropTypes from 'prop-types';
import { getValueFromIndex } from '../utils/helpers';

const Tile = ({ col, row, selectTile }) => (
  <div
    className={`board__tile`}
    onClick={ () => selectTile(col, row)}
  >
    { getValueFromIndex(row) }
  </div>
);

Tile.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  selectTile: PropTypes.func.isRequired,
};

export default Tile;
