import React from 'react';
import PropTypes from 'prop-types';
import { getValueFromIndex, constructClassName } from '../utils/helpers';
import '../styles/components/tile.scss';

const Tile = ({ col, row, selectTile, tile, getIsRight, getIsLocked }) => (
  <button
    type="button"
    className={constructClassName(
      'tile',
      [getIsRight(1, tile.id), 'tile--team1'],
      [getIsRight(2, tile.id), 'tile--team2'],
      [getIsLocked(tile.id), 'tile--locked'],
    )}
    onClick={({ target }) => { target.blur(); selectTile(col, row); }}
  >
    { getValueFromIndex(row) }
  </button>
);

Tile.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  selectTile: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired,
  getIsRight: PropTypes.func.isRequired,
  getIsLocked: PropTypes.func.isRequired,
};

export default Tile;
