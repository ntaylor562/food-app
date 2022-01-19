import React, {Component} from 'react';
import Authentication from "../firebase/auth";
import Button from "react-bootstrap/Button";


class Header extends Component {
	render() {
		return (<React.Fragment>
			<table style={{'width': '100%'}}>
                    <tr>
                        <td>
                            <h2>Food Tracker</h2>
                        </td>
                        <td style={{'text-align':'right'}}>
                            <Button onClick={Authentication.logOut} variant={'danger'}>
								Log Out
							</Button>
                        </td>
                    </tr>
                </table>
		</React.Fragment>)
	}
}

export default Header;