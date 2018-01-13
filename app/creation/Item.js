import request from "../common/request";
import {
  AlertIOS,
  TouchableHighlight,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, {Component} from 'react';

import url from "../common/url";
import Icon from 'react-native-vector-icons/Ionicons';
const screenWidth = Dimensions.get('window').width; //获取屏幕的宽度

export default class Item extends Component {
  constructor(props) {
    super(props);
    let row = this.props.row;
    // console.log('row#######', row);
    this.state = {
      up: row.voted,
      row: this.props.row
    };
  }

  componentWillReceiveProps(nextProps) {
    //子组件更新需要在接收新的参数后更新 state
    // console.log('----componentWillReceiveProps', nextProps);
    this.setState({
      row: nextProps.row
    });
  }

  _up() {
    let up = !this.state.up;
    let row = this.state.row;
    let body = {
      id: row._id,
      up: up ? 'yes' : 'no',
      accessToken: 'zxcv',
    };

    request.post(url.up, body).then(res => {
      // console.log('res', res);
      if (res.success) {
        this.setState({
          up: up
        });
      } else {
        AlertIOS.alert('点赞失败，稍后再试');
      }
    }).catch(error => {
      console.error(error);
      AlertIOS.alert('点赞失败，稍后再试');
    });
  }

  render() {
    let row = this.state.row;

    return (
        <TouchableHighlight>
          <View style={styles.item}>
            <Text style={styles.title}>{row.title}</Text>
            <Image
                source={{uri: row.thumb}}
                style={styles.thumb}
            >
              <Icon
                  name='ios-play'
                  style={styles.play}
                  size={28}
              />
            </Image>
            <View style={styles.itemFooter}>
              <View style={styles.handleBox}>
                <Icon
                    name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
                    style={this.state.up ? styles.up : styles.down}
                    size={28}
                    onPress={this._up.bind(this)}
                />
                <Text style={styles.handleText} onPress={this._up.bind(this)}>喜欢</Text>
              </View>

              <View style={styles.handleBox}>
                <Icon
                    name='ios-chatboxes-outline'
                    style={styles.commentIcon}
                    size={28}
                />
                <Text style={styles.handleText}>评论</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
    );
  }

}


const styles = StyleSheet.create({
  item: {
    width: screenWidth,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  thumb: {
    width: screenWidth,
    height: screenWidth / 1280 * 720,
    resizeMode: 'cover',
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: '#333',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
  },
  handleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    width: screenWidth / 2 - 0.5,
    backgroundColor: '#fff',
  },
  play: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#ed7b66',
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },
  up: {
    fontSize: 22,
    color: '#ed7b66',
  },
  down: {
    fontSize: 22,
    color: '#333',
  },
  commentIcon: {
    fontSize: 22,
    color: '#333',
  },
  loadingMore: {
    marginTop: -30,
    paddingVertical: 10,
  },
  loadingText: {
    color: '#777',
    textAlign: 'center',
  },
  loadingFooter: {
    marginBottom: -30,
    paddingVertical: 10,
  }
});