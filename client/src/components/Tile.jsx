import React from 'react';
import PropTypes from 'prop-types';
import { getValueFromIndex, constructClassName } from '../utils/helpers';

const Tile = ({ col, row, selectTile, tile, hasWrong, hasRight }) => {
  // TODO: hasRight as const
  console.log(tile);
  return (
    <div
      className={constructClassName(
        'board__tile',
        [hasRight(1, tile.id), 'board__tile--team1'],
        [hasRight(2, tile.id), 'board__tile--team2'],
      )}
      onClick={ () => selectTile(col, row)}
    >
      { getValueFromIndex(row) }
    </div>
  );
};

Tile.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  selectTile: PropTypes.func.isRequired,
};

export default Tile;
