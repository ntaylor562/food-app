import './styles/App.css';
import ItemAdder from './components/itemAdder';
import ItemList from './components/itemList';


function App() {
    return (
        <div className="App">
            <div style={{ margin: '20px', height: 'auto' }}>
                <h2>Food Tracker</h2>
                <hr />
                <br />
                <ItemAdder />
                <br />
                <hr />
                <br />
                <ItemList />
            </div>
            <br />
            <p style={{ textAlign: 'center', fontSize: '10pt', color: "#808080" }}>Developed by Nathan Taylor. Contact at nathan.alt562@gmail.com</p>
        </div>
    );
}

export default App;
