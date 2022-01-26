import React,{ useState,useReducer,useEffect } from 'react';
import './App.css'
import KeyBoard from './components/KeyBoard';
/*
to do:
1.backspace button *
2.keyboard color change
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

//---------------------------------------
const App = () => {
  const [currentRow,setCurrentRow] = useState(0)
  const [currentCell, setCurrentCell] = useState(0)
  const [flag,setFlag] = useState(0)
  const [enterKey, setEnterKey] = useState(0)
  const [backspaceKey, setBackspaceKey] = useState(0)
  const [keyPress, setKeyPress] = useState([''])
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

  // cleanup this component
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
    if (flag === 0 && currentRow === 0) { 
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



  //--------------------
  const contentHandler = () => {
    if (currentRow > 5 || flag>4 || keyPress[0] === '') {
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
    if(userContent[i] === secretArr[i]){
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
     
      if(userContent[i] === secretArr[j] && userContent[i] !== null){
        gridDispatcher(
          {
            type: 'type2',
            currentRow,
            currentCell:i,
            status: 'yellow'
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
    if (currentRow ===  6) {
      console.log("row limit exceede from su")
      return;
    }
    let secret = 'APPLE'
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
      <h1>Wordle</h1>
      <KeyBoard
        contentUpdateHandler={contentUpdateHandler} />
      <button onClick={statusUpdateHandler}>ENTER</button>
      <button onClick={deleteHandler}>Backspace</button>
      <div >
        {elements}
        </div>
    </div>
  )
};

export default App;


