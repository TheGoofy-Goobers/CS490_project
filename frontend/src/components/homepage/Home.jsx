import React from "react";
import logo3 from '../navbar/logo3.png'
import './Home.css';
import arrow from './right arrow orange.png'
import javascr from './Image 9.png'
import py from './Image 10.png'
import cprog from './Image 11.png'
import jav from './Image 12.png'
import { Link } from 'react-router-dom';
import paste from './computer-icons-clipboard-cut-copy-and-paste-symbol-removebg-preview.png'
import congrats from './confetti.png'

const Home = () => {
    return (
        <div className="back">
            <div>
            <img className="title" src={logo3}/>

            <div className="intro">
            <h2>codeCraft is where all your code translating needs are met!</h2>
            <h2>Powered by the new ChatGPT-3.5 and fine tuned by us to accomplish all your coding needs.</h2>
            </div>

            
            <h1 className="four">4 Simple Steps to Get Started</h1>
            <div className="steps">
                
                <div className="step1">
                    <h3>Choose Input and Output Language</h3>
                    <div className="langholder">
                        <img id='langs' src={javascr}/>
                        <img id='langs2' src={cprog}/>
                    </div>
                </div>
                <img className='arrows' src={arrow}/>
                <div className="step2">
                    <h3>Paste in your Code</h3>
                    <img className='paste' src={paste}/>
                </div>
                <img className='arrows' src={arrow}/>
                <div className="step3">
                    <h3>ALL DONE!!! 
                        ENJOY YOUR NEW CODE</h3>
                    <img className="finished" src={congrats}/>
                </div>
            </div>
            </div>
            
            <h1>Accepted Languages</h1>
            <div className="Accepted">
                <img className="langs" src={javascr}/>
                <img className="langs" src={py}/>
                <img className="langs" src={cprog}/>
                <img className="langs" id="jav" src={jav}/>
            </div>
            <div className="box">
                <Link to="/translate">
                <button className="translate_now" >Try it out !!!</button>
                </Link>
            </div>
        </div>
    )
}

export default Home;