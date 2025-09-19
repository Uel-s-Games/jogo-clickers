import { useState } from "react";
import './Main.css'
import Store from "../Store/Store";

const Main = () => {
    const [clicks, setClicks] = useState(() => parseInt(localStorage.getItem("clicks")) || 0);
    
    const addClick = () => {
        let current = clicks;
        current++;
        setClicks(current)
        localStorage.setItem('clicks', current);
    };
    
    return (
        <div id="main">
            
            <span id="clicks">{clicks}</span>
            <div id="click-area" onClick={addClick}>Clique aqui</div>
            <div id="item-info" style={{ display: "none" }}></div>

            <div className="parent">
                <div className="div1">1 </div>
                <div className="div2">2</div>
                <div className="div3">3 </div>
                <div className="div4">4 </div>
                <div className="div5">5 </div>
                <div className="div6">6 </div>
                <div className="div7">7 </div>
                <div className="div8">8 </div>
                <div className="div9">9 </div>
            </div>

            
            <Store clicks={clicks} setClicks={setClicks} />
        </div>


    )
}

export default Main;