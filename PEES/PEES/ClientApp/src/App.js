import React from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Management } from './components/management/Management'

import './custom.css'

export default class App extends React.Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/management' component={Management} />
            </Layout>
        );
    }
}
