import React from 'react';
import { get } from 'lodash/object';
import { findIndex, pull, union } from 'lodash/array';
import data from '../../mocks/christmas.json';
import { getValueFromIndex } from '../utils/helpers';
import { Board, Modal, ScoreControls } from './';
import '../styles/components/game.scss';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data,
      activeTeam: null,
      activeTile: [0, 0],
      selectedTile: null,
      team1Right: [],
      team1Wrong: [],
      team2Right: [],
      team2Wrong: [],
      lockedTiles: [],
      moderatorLock: true,
      escapeFunc: () => {},
    };

    // event handlers
    this.setActiveTile = this.setActiveTile.bind(this);
    this.setActiveTeam = this.setActiveTeam.bind(this);
    this.selectTile = this.selectTile.bind(this);
    this.clearSelectedTile = this.clearSelectedTile.bind(this);
    this.awardPoints = this.awardPoints.bind(this);
    this.deductPoints = this.deductPoints.bind(this);
    this.hasRight = this.hasRight.bind(this);
    this.hasWrong = this.hasWrong.bind(this);
    this.toggleTileLock = this.toggleTileLock.bind(this);
    this.isLocked = this.isLocked.bind(this);
  }

  get selectedCategory() {
    return this.state.data.categories[this.state.activeTile[0]];
  }

  get selectedValue() {
    return getValueFromIndex(this.state.activeTile[1]);
  }

  get team1Score() {
    return this.getPoints(1) - this.getDeductions(1);
  }

  get team2Score() {
    return this.getPoints(2) - this.getDeductions(2);
  }

  getPoints(team) {
    return get(this.state, `team${team}Right`, []).reduce((points, id) => (
      points + this.state.data.tiles.reduce((value, category) => (
        value + getValueFromIndex(findIndex(category, cat => cat.id === id))
      ), 0)
    ), 0);
  }

  getDeductions(team) {
    return get(this.state, `team${team}Wrong`, []).reduce((points, id) => (
      points - this.state.data.tiles.reduce((value, category) => (
        value - getValueFromIndex(findIndex(category, cat => cat.id === id))
      ), 0)
    ), 0);
  }

  setActiveTeam(number) {
    this.setState({
      activeTeam: number,
    });
  }

  setActiveTile(col, row) {
    this.setState({
      activeTile: [col, row],
    });
  }

  hasRight(team, id) {
    return get(this.state, `team${team}Right`, []).indexOf(id) >= 0;
  }

  hasWrong(team, id) {
    return get(this.state, `team${team}Wrong`, []).indexOf(id) >= 0;
  }

  isLocked(id) {
    return this.state.lockedTiles.indexOf(id) >= 0;
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

  awardPoints(team, id) {
    this.setState(prevState => ({
      [`team${team}Wrong`]: pull(this.state[`team${team}Wrong`], id),
      [`team${team === '1' ? '2' : '1'}Right`]: pull(this.state[`team${team === '1' ? '2' : '1'}Right`], id),
      [`team${team}Right`]: union(prevState[`team${team}Right`], [id]),
    }));
  }

  deductPoints(team, id) {
    this.setState(prevState => ({
      [`team${team}Right`]: pull(this.state[`team${team}Right`], id),
      [`team${team}Wrong`]: union(prevState[`team${team}Wrong`], [id]),
    }));
  }

  toggleTileLock(id) {
    this.setState(prevState => ({
      lockedTiles: prevState.lockedTiles.indexOf(id) >= 0
        ? pull(prevState.lockedTiles, id)
        : union(prevState.lockedTiles, [id]),
    }));
  }

  render() {
    return (
      <div className="game">
        <Board
          selectTile={this.selectTile}
          activeTeam={this.state.activeTeam}
          setActiveTeam={this.setActiveTeam}
          team1Score={this.team1Score}
          team2Score={this.team2Score}
          hasRight={this.hasRight}
          hasWrong={this.hasWrong}
          isLocked={this.isLocked}
          {...data}
        />
        { this.state.selectedTile &&
          <Modal title={`${this.selectedCategory}: ${this.selectedValue}`} onClose={this.clearSelectedTile}>
            {this.state.selectedTile.question}
            <ScoreControls
              tileId={this.state.selectedTile.id}
              awardPoints={this.awardPoints}
              deductPoints={this.deductPoints}
              hasRight={this.hasRight}
              hasWrong={this.hasWrong}
              toggleTileLock={this.toggleTileLock}
              isLocked={this.isLocked}
            />
          </Modal>
        }
      </div>
    );
  }
}

export default Game;
