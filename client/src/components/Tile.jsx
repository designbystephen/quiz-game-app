import React from 'react';
import PropTypes from 'prop-types';
import { getValueFromIndex, constructClassName } from '../utils/helpers';
import '../styles/components/tile.scss';

const Tile = ({ col, row, selectTile, tile, isRight, isLocked }) => (
  <button
    type="button"
    className={constructClassName(
      'tile',
      [isRight(1, tile.id), 'tile--team1'],
      [isRight(2, tile.id), 'tile--team2'],
      [isLocked(tile.id), 'tile--locked'],
    )}
    onClick={() => selectTile(col, row)}
  >
    { getValueFromIndex(row) }
  </button>
);

Tile.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  selectTile: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired,
  isRight: PropTypes.func.isRequired,
  isLocked: PropTypes.func.isRequired,
};

export default Tile;
