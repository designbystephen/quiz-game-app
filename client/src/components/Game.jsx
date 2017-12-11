import React from 'react';
import data from '../../mocks/christmas.json';
import { Board, Modal } from './';
import '../styles/components/game.scss';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data,
      activeTile: [0, 0],
      selectedTile: null,
    };

    // event handlers
    this.setActiveTile = this.setActiveTile.bind(this);
    this.selectTile = this.selectTile.bind(this);
    this.clearSelectedTile = this.clearSelectedTile.bind(this);
  }

  setActiveTile(col, row) {
    this.setState({
      activeTile: [col, row],
    });
  }

  selectTile(col, row) {
    const tile = this.state.data.tiles[col][row];

    if (tile) {
      this.setState(() => ({
        selectedTile: tile,
      }), this.setActiveTile(col, row));
    }

    return tile;
  }

  clearSelectedTile() {
    this.setState({
      selectedTile: null,
    });
  }

  render() {
    return (
      <div className="game">
        <Board selectTile={this.selectTile} {...data} />

        { this.state.selectedTile &&
          <Modal title={this.state.selectedTile.question} onClose={this.clearSelectedTile}>
            {this.state.selectedTile.answer}
          </Modal>
        }
      </div>
    );
  }
}

export default Game;
