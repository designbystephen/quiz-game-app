import React from 'react';
import { get } from 'lodash/object';
import { findIndex, pull, union } from 'lodash/array';
import { random } from 'lodash/number';
import data from '../../mocks/christmas.json';
import { getValueFromIndex } from '../utils/helpers';
import { Board, Modal } from './';
import '../styles/components/game.scss';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data,
      activeTeam: random(1, 2),
      activeTile: [0, 0],
      selectedTile: null,
      team1Right: [],
      team1Wrong: [],
      team2Right: [],
      team2Wrong: [],
      lockedTiles: [],
      hasModeratorLock: true,
      escapeFunc: () => {},
    };

    // event handlers
    this.setActiveTile = this.setActiveTile.bind(this);
    this.setActiveTeam = this.setActiveTeam.bind(this);
    this.selectTile = this.selectTile.bind(this);
    this.clearSelectedTile = this.clearSelectedTile.bind(this);
    this.awardPoints = this.awardPoints.bind(this);
    this.deductPoints = this.deductPoints.bind(this);
    this.getIsRight = this.getIsRight.bind(this);
    this.getIsWrong = this.getIsWrong.bind(this);
    this.toggleTileLock = this.toggleTileLock.bind(this);
    this.getIsLocked = this.getIsLocked.bind(this);
    this.toggleModeratorLock = this.toggleModeratorLock.bind(this);
    this.setModeratorLock = this.setModeratorLock.bind(this);
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

  setModeratorLock(getIsLocked) {
    this.setState({
      hasModeratorLock: getIsLocked,
    });
  }

  getIsRight(team, id) {
    return get(this.state, `team${team}Right`, []).includes(id);
  }

  getIsWrong(team, id) {
    return get(this.state, `team${team}Wrong`, []).includes(id);
  }

  toggleModeratorLock() {
    this.setState(prevState => ({
      hasModeratorLock: !prevState.hasModeratorLock,
    }));
  }

  getIsLocked(id) {
    return this.state.lockedTiles.includes(id);
  }

  randomizeActiveTeam() {
    this.setState({
      activeTeam: random(1, 2),
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

  awardPoints(team, id) {
    this.setState((prevState) => {
      const state = {
        // remove wrong tally
        [`team${team}Wrong`]: pull(this.state[`team${team}Wrong`], id),

        // remove another team's right tally
        [`team${team === '1' ? '2' : '1'}Right`]: pull(this.state[`team${team === '1' ? '2' : '1'}Right`], id),
      };

      if (prevState[`team${team}Right`].includes(id)) {
        // toggle points (remove awarded points)
        state[`team${team}Right`] = pull(prevState[`team${team}Right`], id);
      } else {
        // award points
        state[`team${team}Right`] = union(prevState[`team${team}Right`], [id]);
      }

      return state;
    });
  }

  deductPoints(team, id) {
    this.setState((prevState) => {
      const state = {
        [`team${team}Right`]: pull(this.state[`team${team}Right`], id),
      };

      if (prevState[`team${team}Wrong`].includes(id)) {
        // toggle points (remove deducted points)
        state[`team${team}Wrong`] = pull(prevState[`team${team}Wrong`], id);
      } else {
        // deduct points
        state[`team${team}Wrong`] = union(prevState[`team${team}Wrong`], [id]);
      }

      return state;
    });
  }

  toggleTileLock(id) {
    this.setState(prevState => ({
      lockedTiles: prevState.lockedTiles.includes(id)
        ? pull(prevState.lockedTiles, id)
        : union(prevState.lockedTiles, [id]),
    }));
  }

  render() {
    return (
      <div className="game">
        <Board
          tile={this.state.selectedTile}
          selectTile={this.selectTile}
          activeTeam={this.state.activeTeam}
          setActiveTeam={this.setActiveTeam}
          team1Score={this.team1Score}
          team2Score={this.team2Score}
          getIsRight={this.getIsRight}
          getIsWrong={this.getIsWrong}
          getIsLocked={this.getIsLocked}
          hasModeratorLock={this.state.hasModeratorLock}
          {...data}
        />
        { this.state.selectedTile &&
          <Modal
            title={`${this.selectedCategory}: ${this.selectedValue}`}
            tile={this.state.selectedTile}
            onClose={this.clearSelectedTile}
            awardPoints={this.awardPoints}
            deductPoints={this.deductPoints}
            getIsRight={this.getIsRight}
            getIsWrong={this.getIsWrong}
            toggleTileLock={this.toggleTileLock}
            getIsLocked={this.getIsLocked}
            hasModeratorLock={this.state.hasModeratorLock}
            setModeratorLock={this.setModeratorLock}
            toggleModeratorLock={this.toggleModeratorLock}
            activeTeam={this.state.activeTeam}
            setActiveTeam={this.setActiveTeam}
            team1Score={this.team1Score}
            team2Score={this.team2Score}
          />
        }
      </div>
    );
  }
}

export default Game;
