import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class FlagApplication extends Component {
    constructor(props) {
        super(props);
        this.getSelectedCountry = this.getSelectedCountry.bind(this);
        this.state = {
            receivedCountryData: props.initialCountryData,
            selectedCountry: props.initialSelectedCountry,
            countryIndex: 0,
            error: undefined
        }
    }
    componentDidMount() {
        axios.get('https://restcountries.eu/rest/v2')
            .then((response) => {
                this.setState((prevState) => {
                    return {
                        receivedCountryData: response.data
                    };
                }); 
            })
            .catch((error) => {
                if (error) {
                    this.setState({ error });
                }
            })
        ;
    }
    getSelectedCountry(selectedCountry, countryIndex) {
        this.setState(() => {
            return {
                selectedCountry,
                countryIndex
            };
        });
    }
    render() {
        return (
            <div className="App">
                <nav className="card">
                    <p>Weather & Info</p>
                    <select className="country-names ">
                        {
                            this.state.receivedCountryData.map((country, index) => {
                                return <Option getSelectedCountry={this.getSelectedCountry} key={country.name} countryName={country.name} index={index}/>;
                            })
                        }
                    </select>
                </nav>
                <div className="container">
                    <div className="row">
                        <CountryInfo 
                            info={{
                                name: this.state.selectedCountry,
                                nativeName: this.state
                            }}
                        />
                        <CallingCode />
                        <FlagHolder />
                        <Weather />
                        <Map />
                    </div>
                </div>
            </div>
        );
    }
}
FlagApplication.defaultProps = {
    initialCountryData: [],
    initialSelectedCountry: 0
}

const Option = (props) => {
    return (
        <option value={props.countryName} onClick={(e) => props.getSelectedCountry(e.target.value, props.index)}>{props.countryName}</option>
    );
}


class CountryInfo extends Component {
    render() {
        return (
        <div className="information-holder">
            info
            <p className="nativeName card-title"></p>
            <p className="capital card-title"></p>
            <p className="region card-title"></p>
            <p className="population card-title"></p>
            <p className="languages card-title"></p>
            <p className="timezones card-title"></p>
        </div>
        );
    }
}

const CallingCode = (props) => {
    return (
        <div className="country-code">
            code
        </div>
    );
}

const FlagHolder = (props) => {
    return (
        <div>
            flag
        </div>
    );
}

class Weather extends Component {
    render() {
        return (
            <div>
                weather
            </div>
        );
    }
}

class Map extends Component {
    render() {
        return (
            <div>
                map
            </div>
        );
    }
}

export default FlagApplication;