import React,{ useState,useReducer } from 'react';
import './App.css'

//---GRID------------------------
const gridGenerator = () => {
  let grid = [], row = [];
  for (let i = 0; i < 6; i++) {
    row = [];
    for (let j = 0; j < 5; j++) {
      row.push(
        {
          status:'black',
          content: ''
        })
    }
    grid.push(row)
  }
  return grid;
}
//-------------------------------------
const App = () => {
  const [currentRow,setCurrentRow] = useState(0)
  const [currentCell, setCurrentCell] = useState(0)
  const [flag,setFlag] = useState(0)
  const intializeGridState = gridGenerator()
  const gridReduserFunc = (state, action) => {
    console.log(state, action);
    switch (action.type) {
      case 'type1': { 
         state[action.currentRow][action.currentCell].content = action.content;
      }
      case 'type2': {
        state[action.currentRow][action.currentCell].status = action.status; 
      }
    }
    return state;
  }
  const [gridState, gridDispatcher] = useReducer(gridReduserFunc, intializeGridState);
   
  //--------------------CONTENT Update----------------------
  const contentUpdateHandler = (e) => {
    if (flag >4) {
      console.log(`cell is ${flag}`);
      return;
    }
    e.preventDefault();
    gridDispatcher({
      type: 'type1',
      currentRow,
      currentCell,
      content:'a'
    })
    setCurrentCell(prevState => (prevState + 1) % 5)
    setFlag(prevState=>prevState+1)
    console.log(currentRow,currentCell,"r,c");

}
  
//--------------Status color Update --------------------------------
  const statusUpdateHandler = () => {
    let secret = 'apale'
    let secretArr = secret.split('')
    const userContent = gridState[currentRow].map(state => state.content).filter(item=> item!=='')
    if (userContent.length < 5) {
      console.log('enter 5 no');
      return; 
    }
    userContent.reduce((total, currentValue, currentIndex) => { //X X X X X X
    
      if (secret[currentIndex] === currentValue) {
        let indexToRemove = secretArr.indexOf(currentValue)
        secretArr = secretArr.filter((item,i)=> i!== indexToRemove)
        gridDispatcher(
          {
            type: 'type2',
            currentRow,
            currentCell:currentIndex,
            status: 'Green'
          }
      
        )
        total++;
      }
      else if (secretArr.includes(currentValue)) {//wrong logic
        let indexToRemove = secretArr.indexOf(currentValue)
        secretArr = secretArr.filter((item,i)=> i!== indexToRemove)
        console.log(currentValue);
        console.log("secretArr",secretArr);
        gridDispatcher(
          {
            type: 'type2',
            currentRow,
            currentCell:currentIndex,
            status: 'Yellow'
          }
      
        )

      }
      else {
        gridDispatcher(
          {
            type: 'type2',
            currentRow,
            currentCell:currentIndex,
            status: 'Grey'
          }
      
        )
      }
      //-------------------------------------------------
      if (total === 5 || currentRow > 6) {
        return 'Game over'
      }
      else {
        setCurrentRow(currentRow + 1)
        setFlag(0)
      }
    },0)
    
    console.log(userContent)
  }

//------------------------------------

 
  return (
    <div className="word-grid">
      <h1>Wordle</h1>
      <button onClick={contentUpdateHandler}>Content</button>
      <button onClick={statusUpdateHandler}>Status</button>
    </div>
  )
};

export default App;


