/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, TabBarIOS} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import List from './app/creation';
import Edit from './app/edit';
import Account from './app/account';


export default class dogShowApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'list'
    };
  }

  render() {
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
            <List/>
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
