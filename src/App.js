import React,{ useState,useReducer } from 'react';
import './App.css'
import KeyBoard from './components/KeyBoard';


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
//-------------------------------------







//---------------------------------------
const App = () => {
  const [currentRow,setCurrentRow] = useState(0)
  const [currentCell, setCurrentCell] = useState(0)
  const [flag,setFlag] = useState(0)
  const intializeGridState = gridGenerator()

//-----------------------------------------------------------

  
  
  

  

const greenFinder = (secretArr,userContent)=>{
  for(let i = 0; i<5 ; i++)
  {
    if(userContent[i] === secretArr[i]){
      
      console.log(`${userContent[i]} marked as green`)
      userContent[i] = null;
      gridDispatcher(
        {
          type: 'type2',
          currentRow,
          currentCell: i,
          status: 'green'
        }
    
      )
      //console.log('userContent is', userContent, userContent[i])
      secretArr[i] = null;
  }
  }

  console.log('s*u: Green',userContent,secretArr)
  return [userContent, secretArr]
  }
  //------------------------------------
  const yellowFinder = (secretArr,userContent)=>{
  for(let i = 0; i< userContent.length ; i++){
    //console.log(`i = ${i} and userContent length = ${userContent.length} `)
    for(let j = 0; j< userContent.length; j++){
      //console.log(`j = ${j} and userContent length = ${userContent.length} `)
      //console.log(userContent[i],secretArr[j])
      if(userContent[i] === secretArr[j] && userContent[i] !== null){
        console.log(`${userContent[i]} marked as yellow`)
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
      console.log(`${userContent[i]} marked as grey`)
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
    console.log(state, action);
    switch (action.type) {
      case 'type1': { 
        state[action.currentRow][action.currentCell].content = action.content;
        break;
      }
      case 'type2': {
        state[action.currentRow][action.currentCell].status = action.status; 
        break;
      }//
      default: {
        state = state;
        }
    }
    return state;
  }
  const [gridState, gridDispatcher] = useReducer(gridReduserFunc, intializeGridState);
   
  //--------------------CONTENT Update----------------------
  const contentUpdateHandler = (e) => {
    e.preventDefault();
    console.log("button clicked",e.target.innerHTML);
    if (flag >4) {
      console.log(`cell is ${flag}`);
      return;
    }
    e.preventDefault();
    gridDispatcher({
      type: 'type1',
      currentRow,
      currentCell,
      content: e.target.innerHTML //Xxxx content should key pressed by user
    })
    setCurrentCell(prevState => (prevState + 1) % 5)
    setFlag(prevState=>prevState+1)
    console.log(currentRow,currentCell,"r,c");

}
  
  
  

//--------------Status color Update --------------------------------
  const statusUpdateHandler = () => {
    let secret = 'APPLE'
    let secretArr = secret.split('')
    let userContent = gridState[currentRow].map(state => state.content).filter(item=> item!=='')
    console.log(userContent);
    //let userContent = ['M','A','P','L','Y']
    if (userContent.length < 5) {
      console.log('enter 5 no');
      return; 
    }

    
    [userContent, secretArr]= greenFinder(secretArr,userContent);
    [userContent, secretArr]=yellowFinder(secretArr,userContent);
    greyFinder(secretArr,userContent);

        setCurrentRow(currentRow + 1)
        setFlag(0)
   
    
    console.log(userContent)
  }

//------------------------------------------------------------------------

 
  const elements = gridState.map(row => {
   return( <div className="word-row">{
     row.map(cell => {
       console.log(cell.status)
        return(
          <div className="word-cell" style={{ backgroundColor:  cell.status }}>{cell.content}</div>
        )
      })
    }</div>)
  })
  
  
  return (
    <div className="word-grid">
      <h1>Wordle</h1>
      <div >
        {elements}
      </div>
      <KeyBoard
        contentUpdateHandler={contentUpdateHandler} />
      <button onClick={statusUpdateHandler}>ENTER</button>
    </div>
  )
};

export default App;


