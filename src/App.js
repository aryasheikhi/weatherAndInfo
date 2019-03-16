import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import PropTypes from 'prop-types';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

const styles = theme => ({
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
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
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
          <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            Material-UI
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
      error: undefined
    };
  }
  componentDidMount() {
    axios
      .get("https://restcountries.eu/rest/v2")
      .then(response => { this.setState({ receivedCountryData: response.data }); })
      .catch(error => { (error) && this.setState({ error }); });
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
        <SearchAppBarStyled />
        <nav className="card">
          <p>Weather & Info</p>
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
        <div className="container">
          <div className="row">
            {this.state.error ? (
              <ErrComp />
            ) : this.state.receivedCountryData.length !== 0 ? (
              <div>
                <CountryInfo
                  name={this.state.selectedCountry}
                  nativeName={
                    this.state.receivedCountryData[this.state.countryIndex]
                      .nativeName
                  }
                  capital={
                    this.state.receivedCountryData[this.state.countryIndex]
                      .capital
                  }
                  region={
                    this.state.receivedCountryData[this.state.countryIndex]
                      .region
                  }
                  population={
                    this.state.receivedCountryData[this.state.countryIndex]
                      .population
                  }
                  languages={this.state.receivedCountryData[
                    this.state.countryIndex
                  ].languages.map(language => {
                    return language.name;
                  })}
                  timezones={
                    this.state.receivedCountryData[this.state.countryIndex]
                      .timezones
                  }
                />
                <CallingCode
                  code={
                    this.state.receivedCountryData[this.state.countryIndex]
                      .callingCodes
                  }
                />
                <FlagHolder
                  flag={
                    this.state.receivedCountryData[this.state.countryIndex].flag
                  }
                />
                <Weather />
                <Map />
              </div>
            ) : (
              <p>Please Wait...</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
FlagApplication.defaultProps = {
  initialCountryData: [],
  initialSelectedCountry: 0
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
    <div>
      <p style={{ color: "red" }}>{props.error}!</p>
    </div>
  );
};

const CountryInfo = props => {
  return (
    <div className="information-holder">
      info
      <p className="nativeName card-title">{props.nativeName}</p>
      <p className="capital card-title">{props.capital}</p>
      <p className="region card-title">{props.region}</p>
      <p className="population card-title">{props.population}</p>
      <p className="languages card-title">{props.languages}</p>
      <p className="timezones card-title">{props.timezones}</p>
    </div>
  );
};

const CallingCode = props => {
  return <div className="country-code">{props.code}</div>;
};

const FlagHolder = props => {
  return (
    <div>
      <img src={props.flag} alt="Flag" />
    </div>
  );
};

class Weather extends Component {
  render() {
    return <div>weather</div>;
  }
}

class Map extends Component {
  render() {
    return <div>map</div>;
  }
}

const SearchAppBarStyled = withStyles(styles)(SearchAppBar);
export default FlagApplication;