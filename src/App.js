import React, { Component } from 'react';
import './App.css';
import Block from './block';

class App extends Component {
  constructor(props){
    super(props);
    this.state={matrix:[
        4,0,0,0,
        2,2,4,2,
        2,0,0,0,
        4,0,0,0,
      ],gameover:false,translate:[
        0,0,0,0,
        0,0,0,0,
        0,0,0,0,
        0,0,0,0,
      ],direction:'none', key:'none'};
      this.key=this.key.bind(this);
      this.focusInput = React.createRef();
  }
  componentDidMount() {
    this.focusInput.current.focus();
    let newMatrix=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    newMatrix[Math.floor(Math.random()*16)]=2;
    //this.setState({matrix: newMatrix});

  }
  componentDidUpdate(prevProps, prevState) {
    this.focusInput.current.focus();
    let temp=this.state.matrix;
    if(temp.indexOf(0)===-1&&this.state.gameover===false){
      this.setState({gameover:true});
      console.log('gameover');
    }

  }
  // test if move is possible, shouldn't be if direction border is full - done 19.11.
  // try to refractor
  // other key cause restart - done 19.11.
  // have bug when adding numbers to the right: the addition works in 2 steps, not just one
  key(event) {
    if(this.state.gameover===false){
      let keypress=false;
      let newMatrix=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      let translateMatrix=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      let tempMatrix=this.state.matrix;
      if(event.key === "ArrowUp"){
        for(let i=0;i<4;i++){
          let subMatrix=[tempMatrix[i],tempMatrix[i+4],tempMatrix[i+8],tempMatrix[i+12]];
          let offset = 0;
          for(let a=0;a<subMatrix.length;a++){
            if(subMatrix[a]!==0){
              translateMatrix[i+a*4]=a*100-offset*100;
              offset++;
            }
          }
          subMatrix=subMatrix.filter((x)=> x>0);
          for(let e=0;e<subMatrix.length;e++){
            
            if(subMatrix[e]===subMatrix[e+1]){
              subMatrix[e]=subMatrix[e]*2;
              subMatrix.splice(e+1,1);
            }
          }
          if(subMatrix.length<4){
            for(;subMatrix.length<4;){
              subMatrix.push(0);
            }
          }
          for(let e=0;e<4;e++){
            newMatrix[e*4+i]=subMatrix[e]
          }
        }
        this.setState({key:'up'});
        keypress=true;
      }
      if(event.key === "ArrowDown"){
        for(let i=0;i<4;i++){
          let subMatrix=[tempMatrix[i],tempMatrix[i+4],tempMatrix[i+8],tempMatrix[i+12]];
          let offset = 0;
          for(let a=3;a>=0;a--){
            if(subMatrix[a]!==0){
              translateMatrix[i+a*4]=(4-a-1)*100-offset*100;
              offset++;
            }
          }
          subMatrix=subMatrix.filter((x)=> x>0);
          for(let e=subMatrix.length-1;e>0;e--){
            if(subMatrix[e]===subMatrix[e-1]){
              subMatrix[e]=subMatrix[e]*2;
              subMatrix.splice(e-1,1)
              e--;
            }
          }
          if(subMatrix.length<4)
            for(;subMatrix.length<4;){
              subMatrix.unshift(0);
            }
          for(let e=0;e<4;e++){
              newMatrix[e*4+i]=subMatrix[e]
          }
        }
        this.setState({key:'down'});
        keypress=true;
      }
      if(event.key === "ArrowLeft"){
        for(let row=0;row<4;row++){
          let subMatrix=tempMatrix.slice(row*4,row*4+4);
          let offset = 0;
          for(let a=0;a<subMatrix.length;a++){
            if(subMatrix[a]!==0){
              translateMatrix[row*4+a]=a*100-offset*100;
              offset++;
            }
          }
          subMatrix=subMatrix.filter((x)=> x>0);
          for(let e=0;e<subMatrix.length;e++){
            if(subMatrix[e]===subMatrix[e+1]){
              subMatrix[e]=subMatrix[e]*2;
              subMatrix.splice(e+1,1);
            }
          }
          if(subMatrix.length<4){
            for(;subMatrix.length<4;){
              subMatrix.push(0);
            }
          }
          for(let i=0; i<4;i++)
            newMatrix[i+row*4]=subMatrix[i]
        }
        this.setState({key:'left'});
        keypress=true;
      }
      if(event.key === "ArrowRight"){
        for(let row=0;row<4;row++){
          let subMatrix=tempMatrix.slice(row*4,row*4+4);
          let offset = 0;
          for(let a=3;a>=0;a--){
            if(subMatrix[a]!==0){
              translateMatrix[row*4+a]=(4-a-1)*100-offset*100;
              offset++;
            }
          }
          subMatrix=subMatrix.filter((x)=> x>0);
          for(let e=subMatrix.length-1;e>0;e--){
            if(subMatrix[e]===subMatrix[e-1]){
              subMatrix[e]=subMatrix[e]*2;
              subMatrix.splice(e-1,1)
              e--;
            }
          }
          if(subMatrix.length<4){
            for(;subMatrix.length<4;){
              subMatrix.unshift(0);
            }
          }
          for(let i=0; i<4;i++)
            newMatrix[i+row*4]=subMatrix[i]
        }
        this.setState({key:'right'});
        keypress=true;
      }
      if(keypress){
        if(newMatrix.length!==0){
          let index=Math.floor(Math.random()*16);
          while(newMatrix[index]!==0){
            index=Math.floor(Math.random()*16);
          }
          let same=true;
          for(let i=0; i<newMatrix.length;i++){
            if(newMatrix[i]!==tempMatrix[i]){
              same=false;
            }
          }
          if(same===false){
            newMatrix[index]=2;
            this.setState({translate:translateMatrix});
            this.setState({direction:'up'});
           // this.setState({matrix: newMatrix});
            //for animation
            setTimeout(() => {
              translateMatrix=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
              this.setState({translate:translateMatrix});
              this.setState({matrix: newMatrix})
            }, 200);
          }
        }
      }
    }
  }
  render() {
    let Matrix=this.state.matrix.map((block, index) => <Block value={block} key={index} keyPressed={this.state.key} translate={this.state.translate[index]}/>);
    return (
      <div tabIndex="0" ref={this.focusInput} className="App" onKeyDown={(e)=>this.key(e)}>
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
