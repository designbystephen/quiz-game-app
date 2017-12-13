/* eslint import/prefer-default-export: 0 */

import { findIndex } from 'lodash/array';

export const getValueFromIndex = index => 200 * (index + 1);

export const constructClassName = (...args) => (
  args.reduce((classString, pair) => {
    if (pair instanceof Array) {
      // if pair position 0 is true, add position 1 string to classNames
      // example of an optional class based on a boolean evaluation
      return pair.length === 2 && pair[0] === true ? `${classString} ${pair[1]}` : classString;
    }

    // add value of pair as if position 0 where true
    // example of a non-optional class
    return `${classString} ${pair}`;
  }, '')
);

export const removeValueFromArray = (value, array) => {
  const index = findIndex(array, value);

  if (index >= 0) {
    array.splice(index, 1);
  }

  return array;
};
