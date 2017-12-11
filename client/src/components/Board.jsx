import React from 'react';
import PropTypes from 'prop-types';
import { Category } from './';

const Board = ({ categories = [], ...rest }) => (
  <div className="board">
    {categories.map((category, index) => (
      <Category key={`category-${index}`} index={index} name={category} {...rest} />
    ))}
  </div>
);

Board.propTypes = {
  categories: PropTypes.array,
};

export default Board;
