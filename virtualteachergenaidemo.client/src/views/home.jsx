import React from 'react';
import Menu from '../components/menu';
import { useEffect, useState } from 'react';

function Home(props) {
    
    function showAlert() {
        history.push('/home');
    }
    
   
    return (
        <div>
           
            <div>
                <div>
                    <h1>{props.title}</h1>
                </div>
                <Menu />
           
            </div>
        </div>
    )
};

export default Home;

