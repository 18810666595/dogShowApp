import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import request from '../common/request';
import url from '../common/url';

const screenWidth = Dimensions.get('window').width; //获取屏幕的宽度


export default class List extends Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.ds = ds;
    this.state = {
      isLoadingTail: false,
      creationLists: [],
      dataSource: ds.cloneWithRows([]),
      page: 0,
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


  componentWillMount() {
    // console.log('componentWillMount');
  }

  componentWillUpdate() {
    // console.log('componentWillUpdate');
  }

  componentDidUpdate() {
    // console.log('componentDidUpdate');
  }

  componentDidMount() {
    console.log('componentDidMount');
    let page = this.state.page;
    List._fetchData.call(this, page); //class 的声明方法内的私有方法需要指定 this
  }

  /**
   * 发请求获取数据列表
   * @param page
   * @private
   */
  static _fetchData(page) {
    console.log('_fetchData start');
    this.setState({
      isLoadingTail: true,
    });
    setTimeout(() => {
      request.get(url.creations, {
        accessToken: 'abcde',
        page: page
      }).then(res => {
        if (!res.success) return;   //如果请求返回失败，则退出函数

        console.log('data', res.data);
        let list = this.state.creationLists.concat(res.data);
        this.setState({
          total: res.total,
          isLoadingTail: false,
          creationLists: list,
          page: this.state.page + 1,
          dataSource: this.ds.cloneWithRows(list)
        });
        console.log('creationLists', this.state.creationLists);
      }).catch(error => {
        this.setState({
          isLoading: false
        });
        throw error;
      });
    }, 2000);

  }

  /**
   * 是否还有更多数据
   * @return {boolean}
   * @private
   */
  static _hasMore() {
    let creationCount = this.state.creationLists.length;
    let creationTotal = this.state.total;
    console.log('creationCount', creationCount);
    console.log('creationTotal', creationTotal);
    return creationCount < creationTotal;
  }

  /**
   * 获取更多的数据
   * @private
   */
  static _fetchMoreData() {
    console.log('_fetchMoreData');
    let page = this.state.page;
    console.log('page', page);
    if (!List._hasMore.call(this) || this.state.isLoadingTail) {
      console.log('不要获取更多数据');
      return;
    }
    console.log('开始获取更多数据啦~~~');
    List._fetchData.call(this, page);
  }

  static _renderFooter() {
    if (!List._hasMore.call(this) && this.state.creationLists.length) {
      // 数据没有更多的时候
      return (
          <View style={styles.loadingMore}>
            <Text style={styles.loadingText}>
              没有更多了
            </Text>
          </View>
      );
    }

    if (!this.state.isLoadingTail) {
      return (
          <View style={styles.loadingMore}/>
      );
    }

    return (
        <ActivityIndicator style={styles.loadingMore}/>
    );
  }

  render() {
    console.log('render start');
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
              onEndReached={List._fetchMoreData.bind(this)}
              onEndReachedThreshold={20}
              renderFooter={List._renderFooter.bind(this)}
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
  },
  loadingMore: {
    marginVertical: 20,
  },
  loadingText: {
    color: '#777',
    textAlign: 'center',
  }
});