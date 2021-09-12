import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import '../itemList.css'
import Database from '../firebase/database';
import Button from 'react-bootstrap/Button';

class ItemList extends Component {
	state = {
		itemList: [],
		subbed: false
	}

	componentDidMount() {
		//Subscribing to the query returning all food items for this user
		Database.allFoodItemsListener((querySnapshot) => {
			let list = [];
			querySnapshot.forEach((d) => {
				list.push({ id: d.id, data: d.data() });
			})
			this.setState({ itemList: list, subbed: true });
		})

		this.setState({ subbed: true });
	}

	formatDate = (date) => {
		return date.toLocaleDateString("en-US");
	}

	render() {
		return (
			<React.Fragment>
				<Table striped bordered>
					<thead>
						<tr>
							<td>
								<p className="item-table-header">Item</p>
							</td>
							<td style={{ width: '150px' }}>
								<p className="item-table-header">Expiration Date</p>
							</td>
						</tr>
					</thead>
					<tbody>
						{this.state.itemList.map((data) => {
							return (
								<tr key={data.id}>
									<td className="item-name">
										{data.data.itemName} {data.id}
									</td>
									<td className="item-expire-date">
										{this.formatDate(data.data.expirationDate.toDate())}
									</td>

								</tr>
							);
						})}
						</tbody>
				</Table>
			</React.Fragment>
		);
	}
}

export default ItemList;
