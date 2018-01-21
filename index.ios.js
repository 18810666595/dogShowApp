/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  TabBarIOS,
  Navigator,
  AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import List from './app/creation';
import Edit from './app/edit';
import Account from './app/account';
import Login from './app/account/login';

export default class dogShowApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'account',
      lsLogin: false,
      user: null,
    };
  }

  componentDidMount() {
    dogShowApp._asyncAppStatus.call(this);
  }

  static _asyncAppStatus() {
    AsyncStorage.getItem('user').then(data => {
      let newState = {};
      if (data) {
        let user = JSON.parse(data);
        if (user && user.accessToken) {
          newState.user = null;
          newState.isLogin = true;
        } else {
          newState.isLogin = false;
          newState.user = null;
        }
        this.setState(newState);
      }
    });
  }

  static _afterLogin(user) {
    let userStr = JSON.stringify(user);
    AsyncStorage.setItem('user', userStr).then(() => {
      this.setState({
        user,
        isLogin: true,
      });
    });
  }

  render() {
    if (!this.state.isLogin) {
      return (
        <Login afterLogin={dogShowApp._afterLogin.bind(this)}/>
      );
    }

    return (
      <TabBarIOS
        tintColor="white"
        barTintColor="darkslateblue">
        <Icon.TabBarItem
          iconName='ios-videocam-outline'
          selectedIconName='ios-videocam'
          selected={this.state.selectedTab === 'list'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>

          <Navigator
            initialRoute={{
              name: 'list',
              component: List,
            }}
            configureScene={(route, routeStack) => {
              return Navigator.SceneConfigs.FloatFromRight;
            }}
            renderScene={(route, navigator) => {
              let Component = route.component;
              return <Component params={route.params} navigator={navigator}/>;
            }}
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
          selected={this.state.selectedTab === 'edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'edit',
            });
          }}>
          <Edit/>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName='ios-more-outline'
          selectedIconName='ios-more'
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account',
            });
          }}>
          <Account/>
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}


AppRegistry.registerComponent('dogShowApp', () => dogShowApp);
