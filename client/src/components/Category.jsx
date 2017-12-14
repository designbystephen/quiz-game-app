import React from 'react';
import PropTypes from 'prop-types';
import { Tile } from './';
import '../styles/components/category.scss';

const CategoryHeader = ({ text }) => (
  <div className={'category__header'}>
    { text }
  </div>
);

CategoryHeader.propTypes = {
  text: PropTypes.any.isRequired,
};

const Category = ({ name, index, tiles = [], ...rest }) => (
  <div className="category">
    <CategoryHeader text={name} />
    {tiles.map((tile, tileIndex) => (
      <Tile key={`tile-${index}-${tileIndex}`} col={index} row={tileIndex} tile={tiles[index][tileIndex]} {...rest} />
    ))}
  </div>
);

Category.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  tiles: PropTypes.array.isRequired,
};

export default Category;
