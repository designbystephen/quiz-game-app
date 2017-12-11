import React from 'react';
import PropTypes from 'prop-types';

const CategoryHeader = ({ text }) => (
  <div className={`board__tile board__tile--header`}>
    { text }
  </div>
);

CategoryHeader.propTypes = {
  text: PropTypes.any
};

export default CategoryHeader;
