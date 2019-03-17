import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import PropTypes from 'prop-types';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  pos: {
    marginBottom: 12,
  },
  root: {
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  }
});

function SearchAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            Weather & Info
          </Typography>
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
SearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

class FlagApplication extends Component {
  constructor(props) {
    super(props);
    this.getSelectedCountry = this.getSelectedCountry.bind(this);
    this.state = {
      receivedCountryData: props.initialCountryData,
      selectedCountry: props.initialSelectedCountry,
      countryIndex: 0,
      error: undefined,
      weather: undefined,
      weatherStat: undefined
    };
  }
  componentDidMount() {
    axios
      .get("https://restcountries.eu/rest/v2")
      .then(response => { this.setState({ receivedCountryData: response.data }); })
      .catch(error => { (error) && this.setState({ error: error.message }); });
  }
  getSelectedCountry(selectedCountry, countryIndex) {
    // this part gets weather conditions
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${this.state.receivedCountryData[countryIndex].capital}&appid=c362e4ea757c7eb0e6b613af7a45eacd`)
      .then(weather => {
        this.setState(() => {
          return {
            selectedCountry,
            countryIndex,
            weather: weather.data
          };
        })
      })
      .catch(error => (error) && this.setState({ weatherStat: error }));
  }
  render() {
    return (
      <div className="App">
        <SearchAppBarStyled />
        <nav className="card">
          <select className="country-names ">
            {this.state.receivedCountryData.map((country, index) => {
              return (
                <Option
                  getSelectedCountry={this.getSelectedCountry}
                  key={country.name}
                  countryName={country.name}
                  index={index}
                />
              );
            })}
          </select>
        </nav>
        <Container>
          <Row>
            {this.state.error ? (<ErrComp error={this.state.error} />)
            : (this.state.receivedCountryData.length !== 0) && (this.state.selectedCountry !== undefined) ? (
              <>
                <CountryInfoStyled
                  name={this.state.selectedCountry}
                  nativeName={this.state.receivedCountryData[this.state.countryIndex].nativeName}
                  capital={this.state.receivedCountryData[this.state.countryIndex].capital}
                  region={this.state.receivedCountryData[this.state.countryIndex].region}
                  population={this.state.receivedCountryData[this.state.countryIndex].population}
                  languages={this.state.receivedCountryData[this.state.countryIndex].languages.map(language => language.name)}
                  timezones={this.state.receivedCountryData[this.state.countryIndex].timezones}
                />
                <FlagHolderStyled
                  flag={this.state.receivedCountryData[this.state.countryIndex].flag}
                />
                <CallingCodeStyled
                  code={this.state.receivedCountryData[this.state.countryIndex].callingCodes}
                />
                {(this.state.weatherStat !== undefined) ? <Weather error={this.state.weatherStat} />
                : <WeatherStyled weather={this.state.weather}/> }
                <MapHolderStyled />
              </>
            ) : (<p>Please Wait...</p>)}
          </Row>
        </Container>
      </div>
    );
  }
}
FlagApplication.defaultProps = {
  initialCountryData: [],
  initialSelectedCountry: undefined
};

const Option = props => {
  return (
    <option
      value={props.countryName}
      onClick={e => props.getSelectedCountry(e.target.value, props.index)}
    >
      {props.countryName}
    </option>
  );
};

const ErrComp = props => {
  return (
    <Col>
      <p style={{ color: "red" }}>{props.error}</p>
    </Col>
  );
};
// sm
// md
// lg
// xl
const CountryInfo = props => {
  const { classes } = props;

  return (
    <Col sm={12} md={6} lg={6} xl={4}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Info
          </Typography>
          <p className="nativeName card-title">Native name: {props.nativeName}</p>
          <p className="capital card-title">Capital city: {props.capital}</p>
          <p className="region card-title">Region: {props.region}</p>
          <p className="population card-title">Population: {props.population}</p>
          <p className="languages card-title">
            Spoken languages: {props.languages.map(languageName => " " + languageName).toString()}
          </p>
          <p className="timezones card-title">Timezones: {props.timezones}</p>
        </CardContent>
      </Card>
    </Col>
  );
};

const FlagHolder = props => {
  const { classes } = props;

  return (
    <Col sm={12} md={6} lg={6} xl={4}>
      <Card className={classes.card}>
        <CardContent>
          <img src={props.flag} alt="Flag" />
        </CardContent>
      </Card>
    </Col>
  )
};

const CallingCode = props => {
  const { classes } = props;

  return (
    <Col sm={12} md={6} lg={6} xl={4}>
      <Card className={classes.card}>
        <CardContent>
          <p>Calling code:</p>
          <p>{props.code}</p>
        </CardContent>
      </Card>
    </Col>
  );
}

const Weather = props => {
  const { classes } = props;

  return (props.error) ? <Col sm={12} md={6} lg={6} xl={4}>{props.error}</Col>
  : ( (props.weather !== undefined) && (
      <Col sm={12} md={6} lg={6} xl={4}>
        <Card className={classes.card}>
          <CardContent>
            <p>Capital Weather:</p>
            <p>Wind Speed: {props.weather.wind.speed} MS</p>
            <p>Temperature: {parseInt(props.weather.main.temp - 273)}°c</p>
            <p>Humidity: {props.weather.main.humidity}%</p>
            <p>Visibility: {props.weather.visibility} m</p>
          </CardContent>
        </Card>
      </Col>
    )
  );
}

class Map extends Component {
  render() {
    return (
      <>
        map
      </>
    );
  }
}

const MapHolder = (props) => {
  const { classes } = props;

  return (
    <Col sm={12} md={12} lg={12} xl={8}>
      <Card className={classes.card}>
        <CardContent>
          <Map />
        </CardContent>
      </Card>
    </Col>
  )
}

const SearchAppBarStyled = withStyles(styles)(SearchAppBar);
const CountryInfoStyled = withStyles(styles)(CountryInfo);
const FlagHolderStyled = withStyles(styles)(FlagHolder);
const CallingCodeStyled = withStyles(styles)(CallingCode);
const WeatherStyled = withStyles(styles)(Weather);
const MapHolderStyled = withStyles(styles)(MapHolder);
export default FlagApplication;