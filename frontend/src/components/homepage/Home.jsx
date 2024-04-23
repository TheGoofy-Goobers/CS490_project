import React from "react";
import logo3 from '../navbar/logo3.webp';
import './Home.css';
import javascr from './Image 9.webp';
import py from './Image 10.webp';
import cprog from './Image 11.webp';
import jav from './Image 12.webp';
import { Link } from 'react-router-dom';


const Home = () => {

    return (
        <div className="back">
            <div>
                <img className="title" src={logo3} />

                <div className="intro">
                    <h2>codeCraft is where all your code translating needs are met!</h2>
                    <h2>Powered by the new ChatGPT-3.5 and fine tuned by us to accomplish all your coding needs.</h2>
                </div>
                 
            </div>

            <h1>Accepted Languages</h1>
            <div className="Accepted">
                <img className="langs" src={javascr} />
                <img className="langs" src={py} />
                <img className="langs" src={cprog} />
                <img className="langs" id="jav" src={jav} />
            </div>
            <div className="box">
                <Link to="/translate">
                    <button className="translate_now" >Try it out !!!</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;