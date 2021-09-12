import './App.css';
import Authentication from './firebase/auth';
import FoodItem from './foodItem';
import ItemList from './components/itemList';

//TEMP
import Database from './firebase/database';

function App() {
    return (
        <div className="App">
            <div style={{ margin: '20px', height: 'auto' }}>
                <button onClick={() => Database.addItem("nathan.taylor562@gmail.com", new FoodItem('blah', new Date()))}>Add item</button>
                <button onClick={() => Database.updateItem("73LRszKw7OTD8X9laot3", new FoodItem('blahhhh', new Date()))}>Update item</button>
                <button onClick={() => Database.removeItem("3ZEhxKN7aempr2DiwnZu")}>Remove item</button>
                <button onClick={() => Authentication.signOut()}>Sign out</button>
                <ItemList />
            </div>
            <p style={{ textAlign: 'center', fontSize: '10pt', color: "#808080" }}>Developed by Nathan Taylor. Contact at nathan.alt562@gmail.com</p>
        </div>
    );
}

export default App;
