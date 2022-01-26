import React from 'react';

const KeyBoard = ({contentUpdateHandler,colorBox}) => {

    const asciiGenerator = () => {
        let elements = []
        for (let i = 65; i <= 90; i++){
            let color = () => {
                return (colorBox.green.includes(i) ? 'green' : colorBox.yellow.includes(i) ? "#d6ac04" :
                    colorBox.grey.includes(i) ? "grey" : "rgb(136, 22, 22)")
            }
            elements.push(<button className="key-cell" style={{
                backgroundColor: color()
            }}
                onClick={contentUpdateHandler}>{String.fromCharCode(i)}</button>)
        }
        return elements
    }
    const keyBoardel = asciiGenerator();

    return <div className="key-grid">
      {keyBoardel}
  </div>;
};

export default KeyBoard;
