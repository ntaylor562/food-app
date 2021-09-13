import React, { Component } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { MobileView, BrowserView } from 'react-device-detect';
import Database from '../firebase/database';
import Authentication from '../firebase/auth';
import FoodItem from '../foodItem';
import '../styles/itemAdder.css';

//Represents a box that allows users to enter their items and submit the data to the database
class ItemAdder extends Component {
    state = {
        showAdder: false, //User has to click the button to show the adder
        inputValue: [], //Values in the text input
        quantities: {}, //Quantities of each item in the adder
        expireDates: {}, //Expiration dates of each item in the adder
        options: [] //Array containing all autocomplete options
    }

    componentDidMount = async () => {
        //Populating the autocomplete options
        this.setState({ options: Object.keys(await Database.getAllOptions()) });
    }

    //Shows or hides the item adder
    toggleAdder = () => {
        this.setState(prevState => {
            return { showAdder: !prevState.showAdder}
        }, this.clearAdder);
    }

    //Capitalizes first letter of the string and lowercases the rest
    formatName(str) {
        let temp = str.toLowerCase();
        if (temp.length === 0) return '';
        temp = temp.charAt(0).toUpperCase() + temp.slice(1);
        return temp;
    }

    //Saves data from the text input for what items are being added
    setInputValue = (val) => {
        this.setState(prevState => {
            let tempQuantities = prevState.quantities;
            let temp = {};
            val.map((v) => {
                v = v.toLowerCase().trim();
                if (!(v in prevState.quantities)) tempQuantities[v] = 1;
                temp[v] = 0;
            })
            return { inputValue: Object.keys(temp), quantities: tempQuantities }
        });
    }

    //Decrements the quantity of a particular item to be added
    decQuantity = (item) => {
        this.setState(prevState => {
            let temp = { ...prevState.quantities };
            item = item.toLowerCase();
            if (prevState.quantities[item] > 1) {
                --temp[item];
            }
            return { quantities: temp }
        });
    }

    //Increments the quantity of a particular item to be added
    incQuantity = (item) => {
        this.setState(prevState => {
            let temp = { ...prevState.quantities };
            item = item.toLowerCase();
            ++temp[item];
            return { quantities: temp }
        });
    }

    //Handles the date picker for expiration dates
    handleDateChange = (item, d) => {
        this.setState(prevState => {
            let temp = prevState.expireDates;
            item = item.toLowerCase();
            temp[item] = d;
            return { expireDates: temp }
        });
    }

    //Resets the adder
    clearAdder = () => {
        this.setState(prevState => {
            return {
                inputValue: [], quantities: {}, expireDates: {}}
        });
    }

    //Submits all items in the adder to the database
    handleSubmit = async () => {
        //Validating
        for (const itemName of this.state.inputValue)
            if (!(itemName in this.state.expireDates)) {
                alert("Please enter an expiration date for '" + this.formatName(itemName) + "'");
                return;
            }

        //Another loop because it would submit partial data if one item wasn't complete
        for (const itemName of this.state.inputValue)
            Database.addItem((await Authentication.getUser()).email, new FoodItem(itemName, this.state.expireDates[itemName], this.state.quantities[itemName]));

        this.clearAdder();

        this.setState({ options: Object.keys(await Database.getAllOptions()) });
    }

    //Gets the item adder box for mobile devices
    getMobileView = () => {
        return (
            this.state.showAdder ?
                <div className="adder-box">
                    <h4>Add</h4>
                    <Autocomplete options={this.state.options}
                        autoComplete
                        openOnFocus
                        selectOnFocus
                        handleHomeEndKeys
                        freeSolo
                        multiple
                        value={this.state.inputValue}
                        onChange={(event, newInputValue) => { this.setInputValue(newInputValue) }}
                        renderInput={(params) => {
                            return <TextField {...params} label='Item' variant='outlined' margin='normal' />
                        }} />
                    <br />
                    <Table>
                        <tbody>
                            {this.state.inputValue.map((itemName) => {
                                return (
                                    <tr key={itemName} style={{ paddingTop: '10px' }}>
                                        <td>
                                            {this.formatName(itemName)}
                                            <div style={{ float: 'right' }}>
                                                <div className="incdecbutton" cursor="pointer" onClick={() => this.decQuantity(itemName)}>-</div>
                                                {" "}{this.state.quantities[itemName]}{" "}
                                                <div className="incdecbutton" cursor="pointer" onClick={() => this.incQuantity(itemName)}>+</div>
                                            </div>
                                            <br />
                                            <div style={{ width: '100%' }}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <DatePicker
                                                        style={{ float: 'right', width: '100%' }}
                                                        margin='normal'
                                                        label="Expiration Date"
                                                        format="MM/dd/yyyy"
                                                        defaultValue={null}
                                                        value={itemName in this.state.expireDates ? this.state.expireDates[itemName] : null}
                                                        onChange={(d) => this.handleDateChange(itemName, d)}
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                    </Table>
                    {this.state.inputValue.length > 0
                        ? <div>
                            <br />
                            <div style={{ display: 'inline-block', width: '100%' }}>
                                <Button variant='secondary' onClick={this.toggleAdder} style={{ width: '44%', marginInline: '3%'}}>Cancel</Button>
                                <Button variant='success' onClick={this.handleSubmit} style={{ width: '44%', marginInline: '3%' }}>Add item{this.state.inputValue.length > 1 && "s"}</Button>
                            </div>
                        </div>
                        : <div>
                            <h4>Empty</h4>
                            <br />
                            <Button variant='secondary' onClick={this.toggleAdder} style={{ width: '100%' }}>Cancel</Button>
                        </div>
                    }
                </div>
                : <Button variant='success' onClick={this.toggleAdder} style={{ width: '100%' }}>Add item(s)</Button>
        );
    }

    //Gets browser view for the adder box
    //TODO Design the browser view
    getBrowserView = () => {
        return this.getMobileView();

        //return (
        //    this.state.showAdder ?
        //        <div>
        //            temp
        //        </div>
        //        : <Button variant='success' onClick={this.toggleAdder}>Add item(s)</Button>
        //);
    }

    render() {
        return (
            <React.Fragment>
                <MobileView>{this.getMobileView()}</MobileView>
                <BrowserView>{this.getBrowserView()}</BrowserView>
            </React.Fragment>
        );
    }
}

export default ItemAdder;
