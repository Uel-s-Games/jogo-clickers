import './GameContainer.css'

const GameContainer = ({children}) => {

    return (
        <div id="game-container">
            { children }
        </div>
    )
}

export default GameContainer;