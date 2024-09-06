import React from 'react';
import { Button } from '@fluentui/react-components';
import Menu from '../components/menu';
import { useEffect, useState } from 'react';

function Home(props) {
    const [forecasts, setForecasts] = useState();

    useEffect(() => {
        populateWeatherData();
    }, []);




    function showAlert() {
        history.push('/home');
    }

    async function populateWeatherData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        setForecasts(data);
    }

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.date}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
           
            <div>
                <div>
                    <h1>{props.title}</h1>
                </div>
                <Menu />
                {/*<div>*/}
                {/*    <Button appearance="primary" onClick={showAlert} >Click </Button>*/}
                {/*</div>*/}

                {/*<p>This component demonstrates fetching data from the server.</p>*/}
                {/*{contents}*/}
            </div>
        </div>
    )
};

export default Home;

