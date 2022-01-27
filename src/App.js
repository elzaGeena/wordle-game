import React,{ useState,useReducer,useEffect } from 'react';
import './App.css'
import KeyBoard from './components/KeyBoard';
/*
to do:
  add styles
*/

//---GRID------------------------
const gridGenerator = () => {
  let grid = [], row = [];
  for (let i = 0; i < 6; i++) {
    row = [];
    for (let j = 0; j < 5; j++) {
      row.push(
        {
          status:'wheat',
          content: ''
        })
    }
    grid.push(row)
  }
  return grid;
}

let words = ["WATER","SOLID", "PRIME","TRUST","PIZZA","FRESH","HAPPY", "ENTRY","WORLD", "ANIME","FAITH"]



//---------------------------------------
const App = () => {
  const [currentRow,setCurrentRow] = useState(0)
  const [currentCell, setCurrentCell] = useState(0)
  const [flag,setFlag] = useState(0)
  const [enterKey, setEnterKey] = useState(0)
  const [backspaceKey, setBackspaceKey] = useState(0)
  const [keyPress, setKeyPress] = useState([''])
  const [secret,setSecret] = useState("")
  const colorBoxReducer = (state, action) => {
    switch (action.type) {
      case 'green': {
        state.green.push(action.content.charCodeAt(0))
        break;
      }
      case 'yellow': {
        state.yellow.push(action.content.charCodeAt(0))
        break;
      }
      case 'grey': {
        state.grey.push(action.content.charCodeAt(0))
        break;
      }
    }
    return state;
  }
  const [colorBox, colorBoxDispatcher] = useReducer(colorBoxReducer,
  {
    green : [], yellow : [], grey : []
  })
  
  const intializeGridState = gridGenerator()

//-----------------------------------------------------------

  const handleKeyDown = (event) => {
    event.preventDefault();
    if (event.keyCode >= 65 && event.keyCode <= 90) {
      setKeyPress([String.fromCharCode(event.keyCode)])
     
      
  }
  else if (event.keyCode === 13) {
    setEnterKey(prevState=>!prevState)
  
    }
    else if (event.keyCode === 8) {
      setBackspaceKey(prevState=>!prevState)
  }
};

useEffect(() => {
  window.addEventListener('keydown', handleKeyDown);
  setSecret(words[Math.floor(Math.random() * words.length)])
  return () => {
  window.removeEventListener('keydown', handleKeyDown);
  };
}, []);
  
  useEffect(() => {
    statusUpdateHandler();
},[enterKey])

useEffect(() => {
  deleteHandler();
},[backspaceKey])
  
  useEffect(() => {
    contentHandler();
  },[keyPress])


//------------------------
  const deleteHandler = () => {
    console.log("delete key");
    if (flag === 0 ) { 
      gridDispatcher({
        type: 'type1',
        currentRow,
        currentCell,
        content: ""
      });
      return;
    }
    console.log("dispatching delete key");
    setCurrentCell(flag - 1);
    setFlag(flag - 1);
    gridDispatcher({
      type: 'type1',
      currentRow,
      currentCell: flag-1,
      content: ""
    });

  }
//---------------------------------


  //--------------------
  const contentHandler = () => {
    if (currentRow > 5 || flag>4 || keyPress[0] === ''|| colorBox.green.length===10) {
      return;
    }
    gridDispatcher({
      type: 'type1',
      currentRow,
      currentCell,
      content: keyPress[0]
    })
    setCurrentCell(prevState => (prevState + 1) % 5)
    setFlag(prevState => prevState + 1)
}

//-------------------------------
const greenFinder = (secretArr,userContent)=>{
  for(let i = 0; i<5 ; i++)
  {
    if (userContent[i] === secretArr[i]) {
      colorBoxDispatcher({
        type: 'green',
        content: userContent[i]
      })
      userContent[i] = null;
      gridDispatcher(
        {
          type: 'type2',
          currentRow,
          currentCell: i,
          status: 'green'
        }
    
      )
      secretArr[i] = null;
  }
  }

  return [userContent, secretArr]
  }
  //------------------------------------
  const yellowFinder = (secretArr,userContent)=>{
  for(let i = 0; i< userContent.length ; i++){
    
    for(let j = 0; j< userContent.length; j++){
     
      if (userContent[i] === secretArr[j] && userContent[i] !== null) {
        colorBoxDispatcher({
          type: 'yellow',
          content: userContent[i]
        })
        gridDispatcher(
          {
            type: 'type2',
            currentRow,
            currentCell:i,
            status: '#d6ac04'
          }
      
        )
      userContent[i] = null;
      secretArr[j] = null;
      break;
    }
  
    }
  }
    return [userContent, secretArr]
  }
  // //--------------------------------------
   const greyFinder = (secretArr,userContent)=>{
  for(let i = 0; i< userContent.length; i++){
    if (userContent[i] !== null) {
      colorBoxDispatcher({
        type: 'grey',
        content: userContent[i]
      })
      gridDispatcher(
        {
          type: 'type2',
          currentRow,
          currentCell: i,
          status: 'grey'
        }
  
      )
    }
  }
  }




//--------------------------------------------------------------------
  const gridReduserFunc = (state, action) => {
    switch (action.type) {
      case 'type1': { 
        state[action.currentRow][action.currentCell].content = action.content;
        break;
      }
      case 'type2': {
        state[action.currentRow][action.currentCell].status = action.status; 
        break;
      }
      default: {
       return  state 
        }
    }
    return state;
  }
  const [gridState, gridDispatcher] = useReducer(gridReduserFunc, intializeGridState);
   
  //--------------------CONTENT Update----------------------
  const contentUpdateHandler = (e) => {
    e.preventDefault();
    setKeyPress([e.target.innerHTML]);

}
 
//--------------Status color Update --------------------------------
  const statusUpdateHandler = () => {
    if (currentRow ===  6 || colorBox.green.length===10) {
      console.log("row limit exceede from su")
      return;
    }
    let secretArr = secret.split('')
    let userContent = gridState[currentRow].map(state => state.content).filter(item=> item!=='')
    if (userContent.length < 5) {
      console.log('enter 5 no');
      return; 
    }
    
    [userContent, secretArr]= greenFinder(secretArr,userContent);
    [userContent, secretArr]=yellowFinder(secretArr,userContent);
    greyFinder(secretArr,userContent);

    setCurrentRow(currentRow + 1)
      console.log("Current row: " + currentRow);
        setFlag(0)
  }

//------------------------------------------------------------------------

 
  const elements = gridState.map(row => {
   return( <div className="word-row">{
     row.map(cell => {
        return(
          <div className="word-cell" style={{ backgroundColor:  cell.status }}>{cell.content}</div>
        )
      })
    }</div>)
  })
  
  
  return (
    <div className="word-grid">
      <h1 className="heading">Wordle</h1>
      <KeyBoard
        contentUpdateHandler={contentUpdateHandler}  colorBox={colorBox}/>
      <button className="other-keys" onClick={statusUpdateHandler}>Enter</button>
      <button className="other-keys" onClick={deleteHandler}>Backspace</button>
      <div >
        {elements}
        </div>
    </div>
  )
};

export default App;


