import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Database from '../firebase/database';
import SwipeToDelete from 'react-swipe-to-delete-ios';
import { MobileView, BrowserView } from 'react-device-detect';
import '../styles/itemList.css'

//Represents the list of items the user has, displaying a mobile and desktop friendly table of all their items and their data
//TODO Add edit buttons (in modal for mobile and add a button for desktop view)
class ItemList extends Component {
	state = {
		items: {},
		loaded: false,
		showModal: false,
		shownItem: null,
		shownItemID: null,
		modalContents: null
	}

	//Arbitrary number of days at which a food item would change color to signify it's close to its expiration
	thresholds = {
		red: 2,
		orange: 7,
		yellow: 14
	}

	componentDidMount() {
		//Subscribing to the query returning all food items for this user
		Database.allFoodItemsListener((querySnapshot) => {
			let items = {};
			querySnapshot.forEach((d) => {
				items[d.id] = d.data();
			})
			this.setState(prevState => {
				return { items: items, loaded: true }
			});
		})
	}

	formatDate = (date) => {
		return date.toLocaleDateString("en-US");
	}

	//Hides the item from user's list view
	handleDelete = (itemID) => {
		Database.hideItem(itemID);
	}

	toggleModal = () => {
		this.setState(prevState => {
			return { showModal: !prevState.showModal }
		});
	}

	//Shows the more detailed info for an item in a modal
	showInfo = (itemID) => {
		let i = { ...this.state.items[itemID] };
		this.setState(prevState => { return { shownItem: i, shownItemID: itemID }}, () => this.toggleModal());
	}

	msToTime(duration) {
		let milliseconds = parseInt((duration % 1000));
		let seconds = Math.floor((duration / 1000) % 60);
		let minutes = Math.floor((duration / (1000 * 60)) % 60);
		let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
		let days = Math.floor(duration / (1000 * 60 * 60 * 24));

		return {
			days,
			hours,
			minutes,
			seconds,
			milliseconds
		};
	}

	//Returns the number of days until the expiration date provided
	getDaysLeft(exp) {
		return this.msToTime(Math.abs(exp - Date.now())).days;
	}

	//Gets warning color for food near expiration
	getColor(exp) {
		//Expired, return gray
		if (exp - new Date().setHours(0, 0, 0, 0) < 0) return '#a1a1a1';
		else if (this.getDaysLeft(exp) <= this.thresholds.red) return '#bd0000';
		else if (this.getDaysLeft(exp) <= this.thresholds.orange) return '#ffae00';
		else if (this.getDaysLeft(exp) <= this.thresholds.yellow) return '#ffee00';
		else return '#ffffff'; //Return white
	}

	//Decrements the quantity of a particular item to be added
	decQuantity = () => {
		this.setState(prevState => {
			if (prevState.shownItem.quantity > 1)
				return {
					shownItem: {
						...prevState.shownItem,
						quantity: prevState.shownItem.quantity - 1
					}
				}
			else return;
		});
	}

	//Increments the quantity of a particular item to be added
	incQuantity = () => {
		this.setState(prevState => ({
			shownItem: {
				...prevState.shownItem,
				quantity: prevState.shownItem.quantity + 1
			}
		}));
	}

	//Updates the item being shown in the modal
	updateShownItemInList = () => {
		Database.updateItem(this.state.shownItemID, this.state.shownItem);
		this.toggleModal();
	}

	//Mobile view of the table
	getMobileView = () => {
		return (
			<div className="item-table">
				<div>
					<div className="item-table-header-mobile">
						<div className="item-name">
							Item
						</div>
						<div className="item-expire-date">
							Expires
						</div>
					</div>
				</div>
				{Object.keys(this.state.items).map((k) => {
					return (
						<div key={k} style={{ marginInline: '20px' }}>
							<SwipeToDelete height={70} onDelete={() => this.handleDelete(k)}>
								<div className="item-row" style={{ background: this.getColor(this.state.items[k].expirationDate.toDate()) }} onClick={() => this.showInfo(k)}>
									<div className="item-name">
										{this.state.items[k].itemName} ({this.state.items[k].quantity})
									</div>
									<div className="item-expire-date">
										{this.formatDate(this.state.items[k].expirationDate.toDate())}
									</div>
								</div>
							</SwipeToDelete>
						</div>
					);
				})}


			</div>
		);
	}

	//Browser view of the table
	getBrowserView = () => {
		return (
			<Table bordered>
				<thead>
					<tr className="item-table-header-browser">
						<td style={{ borderLeft: 'none', borderTop: 'none' }}>
							
						</td>
						<td className="item-name">
							<p>Item</p>
						</td>
						<td className="item-quantity">
							<p>Quantity</p>
						</td>
						<td>
							<p className="item-expire-date" style={{ textAlign: 'center' }}>Expiration Date</p>
						</td>
					</tr>
				</thead>
				<tbody>
					{Object.keys(this.state.items).map((k) => {
						return (
							<tr key={k} style={{ background: this.getColor(this.state.items[k].expirationDate.toDate()) }}>
								<td style={{ borderLeft: 'none', borderTop: 'none', borderBottom: 'none', fontWeight: 'bold', }}>
									<div style={{ color: '#c92241', cursor: 'pointer' }} onClick={() => this.handleDelete(k)}>X</div>
								</td>
								<td className="item-name">
									{this.state.items[k].itemName}
								</td>
								<td className="item-quantity">
									{this.state.items[k].quantity}
								</td>
								<td className="item-expire-date">
									{this.formatDate(this.state.items[k].expirationDate.toDate())}
								</td>

							</tr>
						);
					})}
				</tbody>
			</Table>
		);
	}

	render() {
		let mobileView = this.getMobileView();
		let browserView = this.getBrowserView();
		return (
			<React.Fragment>
				{Object.keys(this.state.items).length > 0 || !this.state.loaded ?
					<div>
						<MobileView>{mobileView}</MobileView>
						<BrowserView>{browserView}</BrowserView>
					</div>
					: <h4>You currently have no items in the list. Add an item to view it here</h4>
				}

				{this.state.showModal && //This is the modal for more details on a food item
					<Modal show={this.state.showModal} onHide={this.toggleModal}>
						<Modal.Header>
							<Modal.Title style={{ overflowWrap: 'anywhere' }}>{this.state.shownItem.itemName}</Modal.Title>
							<div style={{ float: 'right' }}>
								<div className="incdecbutton" cursor="pointer" onClick={() => this.decQuantity()}>-</div>
								{" "}{this.state.shownItem.quantity}{" "}
								<div className="incdecbutton" cursor="pointer" onClick={() => this.incQuantity()}>+</div>
							</div>
						</Modal.Header>
						<Modal.Body>
							Date Added: {this.formatDate(this.state.shownItem.dateAdded.toDate())}
							<br />
							Expires: {this.formatDate(this.state.shownItem.expirationDate.toDate())}
						</Modal.Body>
						<Modal.Footer>
							<div style={{ display: 'inline-block', width: '100%' }}>
								<Button variant='secondary' onClick={this.toggleModal} style={{ width: '44%', marginInline: '3%' }}>Cancel</Button>
								<Button variant='success' onClick={this.updateShownItemInList} style={{ width: '44%', marginInline: '3%' }}>Update Item</Button>
							</div>
						</Modal.Footer>
					</Modal>
				}
				
			</React.Fragment>
		);
	}
}

export default ItemList;
