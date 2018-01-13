import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state={
      params: this.props.params
    }
  }

  static _back() {
    this.props.navigator.pop();
  }

  // componentWillReceiveProps(nextProps){
  //   this.setState({
  //     params: nextProps.params
  //   })
  // }

  render() {

    let row = this.state.params.row;
    let xxx =this.props.params.xxx;
    console.log('row####', row);
    // console.log('this.props', this.props);
    return (
        <View style={styles.container}>
          <Text onPress={Details._back.bind(this)}>
            {xxx}详情页面{row._id}
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