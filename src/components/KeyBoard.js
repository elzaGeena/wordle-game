import React from 'react';

const KeyBoard = ({contentUpdateHandler}) => {

    const asciiGenerator = () => {
        let elements = []
        for (let i = 65; i <= 90; i++){
            elements.push(<button className="key-cell"
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
