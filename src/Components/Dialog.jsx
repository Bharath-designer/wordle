import styles from "./styles/Dialog.module.css"

const Dialog = ({ success }) => {

    const reload = () => {
        location.reload()
    }
    
    return (
        <div className={styles.dialogContainer}>
            <div className={`${styles.dialog} ${success ? styles.success : styles.fail}`}>
                {success ? (
                    "Congrats! You guessed the word"
                ) : (
                    <>
                        <span>"Oops! You lost the game"</span>
                        <button onClick={reload} className={styles.btn}>Retry</button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Dialog
