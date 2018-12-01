import React, { Component } from 'react';
import './App.css';
import Block from './block';
import { throttle, isEqual } from 'lodash';

const animTime = 0.2;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matrix: Array(16).fill(0),
            gameover: false,
            translate: Array(16).fill(0),
            direction: 'none',
            key: 'none'
        };
        this.key = this.key.bind(this);
        this.focusInput = React.createRef();
        this.throttledKey = throttle(this.key, animTime * 1000);
    }
    componentDidMount() {
        this.focusInput.current.focus();
        let newMatrix = Array(16).fill(0);
        newMatrix[Math.floor(Math.random() * 16)] = 2;
        this.setState({ matrix: newMatrix });

    }
    componentDidUpdate(prevProps, prevState) {
        this.focusInput.current.focus();
        let temp = this.state.matrix;
        if (temp.indexOf(0) === -1 && this.state.gameover === false) {
            // check if more moves are possible: get line by line and row by row and test if up/down-left/right are possible by
            // comparing sent and received arrays. if not possible, gameover. if possible, don't flag.
            // currently calculates as it should but doesn't reset the compare? - done 1.12.
            let gameover = 0;
            let compareMatrix = [];
            for(let i=0;i<4;i++){
                compareMatrix = [temp[i*4+0], temp[i*4+1], temp[i*4+2], temp[i*4+3] ]
                let resultMatrix = this.calcTransform(compareMatrix);
                if(resultMatrix.temptranslate.reduce((accumulator, currentValue) => accumulator + currentValue)===0)
                    gameover++
                compareMatrix = [temp[i*4+3], temp[i*4+2], temp[i*4+1], temp[i*4+0] ]
                resultMatrix = this.calcTransform(compareMatrix);
                if(resultMatrix.temptranslate.reduce((accumulator, currentValue) => accumulator + currentValue)===0)
                    gameover++;
                compareMatrix = [temp[i], temp[i+4], temp[i+8], temp[i+12] ]
                resultMatrix = this.calcTransform(compareMatrix);
                if(resultMatrix.temptranslate.reduce((accumulator, currentValue) => accumulator + currentValue)===0)
                    gameover++;
                compareMatrix = [temp[i+12], temp[i+8], temp[i+4], temp[i] ]
                resultMatrix = this.calcTransform(compareMatrix);
                if(resultMatrix.temptranslate.reduce((accumulator, currentValue) => accumulator + currentValue)===0)
                    gameover++;
            }
            if(gameover===16){
              this.setState({gameover: true});
            }
        }

    }
    calcTransform(subMatrix) {
        let tempTranslate = [0, 0, 0, 0]
        let offset = 0;
        subMatrix.map((val, index) => {
            if (val !== 0) {
                tempTranslate[index] = index * 100 - offset * 100;
                offset++;
            }
        })
        for (let e = 0; e < subMatrix.length; e++) {
            for (let a = 1 + e; a < subMatrix.length; a++) {
                if (subMatrix[a] !== 0) {
                    if (subMatrix[e] === subMatrix[a]) {
                        subMatrix[e] *= 2;
                        subMatrix[a] = 0;
                        tempTranslate[a] += 100;
                        for (a + 1; a < subMatrix.length; a++) {
                            if (subMatrix[a] !== 0)
                                tempTranslate[a] += 100;
                        }
                    }
                    a = subMatrix.length;
                }
            }
        }
        return { 'temptranslate': tempTranslate, 'submatrix': subMatrix };
    }
    // test if move is possible, shouldn't be if direction border is full - done 19.11.
    // try to refractor - done 30.11.
    // other key cause restart - done 19.11.
    // have bug when adding numbers to the right: the addition works in 2 steps, not just one - done
    // fix css transitions, slide only on same or free cells - done 24.11.
    // calculate if there are possible moves by looking at neighbouring array cells -> for gameover - done 30.11.
    // get rid of this: index.js:1452 Warning: This synthetic event is reused for performance reasons. If you're seeing this, you're accessing the method `key` on a released/nullified synthetic event. This is a no-op function. If you must keep the original synthetic event around, use event.persist(). See https://fb.me/react-event-pooling for more information.
    // got a new problem with adding ajecent fields - done 30.11.

    key(event) {
        if (this.state.gameover === false) {
            let keypress = false;
            let newMatrix = Array.from(Array(16), () => 0);
            let translateMatrix = Array.from(Array(16), () => 0);
            const tempMatrix = this.state.matrix;
            if (event.key === "ArrowUp") {
                for (let i = 0; i < 4; i++) {
                    let subMatrix = [tempMatrix[i], tempMatrix[i + 4], tempMatrix[i + 8], tempMatrix[i + 12]];
                    let transformed = this.calcTransform(subMatrix);
                    transformed.temptranslate.map((val, index) => translateMatrix[i + index * 4] = val)
                    transformed.submatrix = transformed.submatrix.filter((x) => x > 0);
                    for (; transformed.submatrix.length < 4;)
                        transformed.submatrix.push(0);
                    transformed.submatrix.forEach((val, index) => newMatrix[index * 4 + i] = val)
                }
                this.setState({ key: 'up' });
                keypress = true;
            }
            if (event.key === "ArrowDown") {
                for (let i = 0; i < 4; i++) {
                    let subMatrix = [tempMatrix[i + 12], tempMatrix[i + 8], tempMatrix[i + 4], tempMatrix[i]];
                    let transformed = this.calcTransform(subMatrix);
                    transformed.temptranslate.reverse()
                    transformed.temptranslate.map((val, index) => translateMatrix[i + index * 4] = val)
                    transformed.submatrix = transformed.submatrix.filter((x) => x > 0);
                    for (; transformed.submatrix.length < 4;)
                        transformed.submatrix.push(0);
                    transformed.submatrix.forEach((val, index) => newMatrix[(3 - index) * 4 + i] = val)
                }
                this.setState({ key: 'down' });
                keypress = true;
            }
            if (event.key === "ArrowLeft") {
                for (let row = 0; row < 4; row++) {
                    let subMatrix = tempMatrix.slice(row * 4, row * 4 + 4);
                    let transformed = this.calcTransform(subMatrix);
                    transformed.temptranslate.map((val, index) => translateMatrix[row * 4 + index] = val)
                    transformed.submatrix = transformed.submatrix.filter((x) => x > 0);
                    for (; transformed.submatrix.length < 4;)
                        transformed.submatrix.push(0);
                    transformed.submatrix.forEach((val, index) => newMatrix[row * 4 + index] = val)
                }
                this.setState({ key: 'left' });
                keypress = true;
            }
            if (event.key === "ArrowRight") {
                for (let row = 0; row < 4; row++) {
                    let subMatrix = tempMatrix.slice(row * 4, row * 4 + 4);
                    subMatrix.reverse();
                    let transformed = this.calcTransform(subMatrix);
                    transformed.temptranslate.reverse();
                    transformed.temptranslate.map((val, index) => translateMatrix[row * 4 + index] = val)
                    transformed.submatrix = transformed.submatrix.filter((x) => x > 0);
                    for (; transformed.submatrix.length < 4;)
                        transformed.submatrix.push(0);
                    transformed.submatrix.reverse();
                    transformed.submatrix.forEach((val, index) => newMatrix[row * 4 + index] = val)
                }
                this.setState({ key: 'right' });
                keypress = true;
            }
            if (keypress) {
                if (newMatrix.length !== 0) {
                    let index = Math.floor(Math.random() * 16);
                    while (newMatrix[index] !== 0) {
                        index = Math.floor(Math.random() * 16);
                    }
                    let same = true;
                    newMatrix.map((val, index) => {
                        if (val !== tempMatrix[index]) same = false
                    })
                    if (same === false) {
                        const randomNewNumber = Math.floor(Math.random() * 100);
                        (randomNewNumber < 85) ? newMatrix[index] = 2: newMatrix[index] = 4;
                        this.setState({ translate: translateMatrix, direction: 'up', anim: 1 });
                        //for animation
                        setTimeout(function() {
                            this.setState({ translate: Array(16).fill(0), matrix: newMatrix, anim: 0 });
                        }.bind(this), animTime * 1000);
                    }
                }
            }
        }
    }
    render() {
        let Matrix = this.state.matrix.map((block, index) => <Block time={animTime} value={block} key={index} anim={this.state.anim} keyPressed={this.state.key} translate={this.state.translate[index]}/>);
        return (
            <div tabIndex="0" ref={this.focusInput} className="App" onKeyDown={this.throttledKey}>
        <div className="matrix-container">
          {Matrix}
        </div>
        <div style={{zIndex:'1',backgroundColor:'rgb(0,0,0,0.4)', overflow:'auto',position:'fixed', top:'0px', left:'0px', width:'100%', height:'100%', display:(this.state.gameover)?'block':'none'}}>
          <div style={{position:'relative', top:'50%', transform:'translateY(-50%)',textAlign:'center',fontSize:'190px', margin:'auto', width:'80%', backgroundColor:'#dddddd'}}>Game Over</div>
        </div>
      </div>
        );
    }
}

export default App;