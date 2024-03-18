import React from "react";
import logo3 from '../navbar/logo3.png'
import './Home.css';
import arrow from './right arrow orange.png'
import javascr from './Image 9.png'
import py from './Image 10.png'
import cprog from './Image 11.png'
import jav from './Image 12.png'
import paste from './computer-icons-clipboard-cut-copy-and-paste-symbol-removebg-preview.png'

const Home = () => {
    return (
        <div className="back">
            <img className="title" src={logo3}/>
            <h2>codeCraft is where all your code translating needs are met!</h2>
            <h2>Powered by the new ChatGPT-3.5 and fine tuned by us to accomplish all your coding needs.</h2>

            <h1>4 Simple Steps to Get Started</h1>

            <div className="steps">
                <div className="step1">
                    <h3>Choose Input and Output Language</h3>
                    <img src={javascr}/>
                    <img src={cprog}/>  
                </div>
                <img src={arrow}/>
                <div className="step2">
                    <h3>Paste in your Code</h3>
                    <img src={paste}/>
                </div>
                <img src={arrow}/>
                <div className="step3">
                    <h3>ALL DONE!!!</h3>
                </div>
            </div>
        </div>
    )
}

export default Home;