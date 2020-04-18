import React from 'react';
import Cookies from 'js-cookie'

export class Home extends React.Component {
    static displayName = Home.name;

    render() {
        /*if (Cookies.get('AccessToken') === undefined) {
            window.location.href = "/auth"
            return (<></>)
        }*/

        return (
            <div>
                <h1>Authenticated</h1>
            </div>
        );
    }
}
