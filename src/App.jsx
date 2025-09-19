import { useState } from 'react';
import GameContainer from './components/GameContainer/GameContainer';
import Menu from "./components/Menu/Menu"
import './global.css'
import Main from "./components/Main/Main"
import Store from "./components/Store/Store"

function App() {

  return (
    <>
      <GameContainer>
        <Menu/>
        <Main/>
        <Store/>
      </GameContainer>
       
    </>
  )
}

export default App
