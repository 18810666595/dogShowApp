import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width; //获取屏幕的宽度


export default class List extends Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.ds = ds;
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };

  }

  static renderRow(row) {
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
                    name='ios-heart-outline'
                    style={styles.up}
                    size={28}
                />
                <Text style={styles.handleText}>喜欢</Text>
              </View>

              <View style={styles.handleBox}>
                <Icon
                    name='ios-chatboxes-outline'
                    style={styles.commentIcon}
                    size={28}
                />
                <Text style={styles.handleText}>评论12</Text>
              </View>
            </View>

          </View>
        </TouchableHighlight>
    );
  }

  /**
   * async 函数异步获取创意列表
   * @return {Promise<any>}
   */
  static async getCreationLists() {
    try {
      let response = await fetch('http://rap2api.taobao.org/app/mock/3605/GET/api/creations');
      let result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  componentDidMount() {
    List.getCreationLists().then(res => {
      console.log(res.data);
      console.log(this.ds);
      this.setState({
        dataSource: this.ds.cloneWithRows(res.data)
      });
    });
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              列表页面
            </Text>
          </View>
          <ListView
              dataSource={this.state.dataSource}
              renderRow={List.renderRow.bind(this)}
              enableEmptySections={true}
              automaticallyAdjustContentInsets={false}
          />
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
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
    color: '#333',
  },
  commentIcon: {
    fontSize: 22,
    color: '#333',
  }
});