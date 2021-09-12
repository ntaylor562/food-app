import React, { Component } from 'react';
import Database from '../firebase/database';

import FoodItem from '../foodItem';

class ItemAdder extends Component {
    render() {
        return (
            <React.Fragment>
                <button onClick={() => Database.addItem("nathan.taylor562@gmail.com", new FoodItem('blah', new Date(new Date().setDate(new Date().getDate() + 50))))}>Add item</button>
                <button onClick={() => Database.updateItem("73LRszKw7OTD8X9laot3", new FoodItem('blahhhh', new Date()))}>Update item</button>
                <button onClick={() => Database.removeItem("3ZEhxKN7aempr2DiwnZu")}>Remove item</button>
            </React.Fragment>
        );
    }
}

export default ItemAdder;
