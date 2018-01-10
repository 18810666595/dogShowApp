import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class List extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={styles.container}>
          <Text>
            列表页面
          </Text>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});