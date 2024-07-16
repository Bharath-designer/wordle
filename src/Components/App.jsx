import React, { useEffect, useState } from "react";
import styles from "./styles/App.module.css"
import Dialog from "./Dialog";

let Isfnished = false;
const App = () => {
  const rows = 6;
  const cols = 5;

  const [index, setIndex] = useState({ row: 0, col: 0 });

  const [gridItems, setGridItems] = useState(
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ letter: "", color: "black" }))
    )
  );

  const [words, setWords] = useState();
  const [dialog, setDialog] = useState(null)
  useEffect(() => setWords(["APPLE", "MANGO", "GRAPE"][Math.floor(Math.random() * 3)]), []);

  const checkWord = () => {
    const currentWord = gridItems[index.row]
      .map((item) => item.letter)
      .join("");
    if (words === currentWord) {
      setGridItems((prev) => {
        const temp = [...prev];
        for (let i = 0; i < cols; i++) {
          temp[index.row][i].color = "green";
        }
        setIndex(prev => ({ ...prev, col: 0 }));
        return temp;
      });

      return true;
    } else {
      setGridItems((prev) => {
        const temp = [...prev];
        for (let i = 0; i < cols; i++) {
          if (currentWord[i] === words[i]) {
            temp[index.row][i].color = "green";
          } else if (words.includes(currentWord[i])) {
            temp[index.row][i].color = "orange";
          } else {
            temp[index.row][i].color = "grey";
          }
        }
        return temp;
      });

      setIndex(prev => ({ row: prev.row + 1, col: 0 }));
      return false;
    }
  };

  const handleEnterCheck = () => {
    setTimeout(() => {

      if (checkWord()) {
        setDialog({success: true})
        Isfnished = true;  
        const activeElement = document.querySelector(`.${styles['active']}`)
        activeElement && activeElement.classList.remove(styles['active'])
      } else if (rows - 1 == index.row) {
        Isfnished = true;
        setDialog({success: false})
      }
    }, 0);
  }


  useEffect(() => {
    const activeElement = document.querySelector(`.${styles['active']}`)
    activeElement && activeElement.classList.remove(styles['active'])
    const currentElement = document.querySelector(`[data-row-col=r${index.row}-c${index.col}`)
    currentElement?.classList.add(styles['active'])
  }), [index]


  useEffect(() => {
    if (index.col === cols) {
      handleEnterCheck()
    }
  }, [gridItems])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!Isfnished) {
        switch (e.keyCode) {
          case 8:
            setGridItems((prev) => {
              index.col > 0 && setIndex(prev => ({ ...prev, col: prev.col - 1 }))
              const temp = [...prev];
              temp[index.row][index.col] = { letter: "", color: "black" };
              return temp;
            });
            break;

          default:
            if (e.keyCode >= 65 && e.keyCode <= 90) {
              if (index.col > cols - 1) {
                return;
              }
              setGridItems((prev) => {
                const temp = [...prev];
                temp[index.row][index.col] = {
                  letter: e.key.toUpperCase(),
                  color: "black",
                };
                return temp;
              });

              setIndex(prev => ({ ...prev, col: prev.col + 1 }))

            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [index, gridItems]);

  return (
    <>
    {dialog && <Dialog success={dialog.success}/>}
      <div className={styles['grid-container']}>
        {gridItems.map((row, rowIndex) =>
          row.map((item, colIndex) => (
            <div
              style={{ background: item.color }}
              className={styles['grid-item']}
              data-row-col={`r${rowIndex}-c${colIndex}`}
              key={`r${rowIndex}-c${colIndex}`}
            >
              {item.letter}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default App;
