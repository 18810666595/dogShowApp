import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  AlertIOS,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import request from '../common/request';
import url from '../common/url';

const screenWidth = Dimensions.get('window').width; //获取屏幕的宽度

class Item extends Component {
  constructor(props) {
    super(props);
    let row = this.props.row;
    console.log('row#######', row);
    this.state = {
      up: row.voted,
      row: this.props.row
    };
  }

  componentWillReceiveProps(nextProps) {
    //子组件更新需要在接收新的参数后更新 state
    console.log('----componentWillReceiveProps', nextProps);
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
      console.log('res', res);
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
      isRefreshing: false,
    };
  }

  static renderRow(row) {
    return (
        <Item row={row}/>
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
    console.log('page didmount', page);
    List._fetchData.call(this, page); //class 的声明方法内的私有方法需要指定 this
  }

  /**
   * 发请求获取数据列表
   * @param page
   * @private
   */
  static _fetchData(page) {
    console.log('_fetchData start');
    if (-1 !== page) {  //上滑预加载
      this.setState({
        isLoadingTail: true,
      });
    } else {  // 下滑刷新
      this.setState({
        isRefreshing: true,
      });
    }

    console.log('state', this.state);
    // setTimeout(() => {
    request.get(url.creations, {
      accessToken: 'abcde',
      page: page
    }).then(res => {
      console.log('获取数据啦');
      if (!res.success) return;   //如果请求返回失败，则退出函数

      console.log('data', res.data, page);
      // let list;
      if (page !== -1) {  //上滑预加载
        console.log('上滑预加载啦');
        let list = this.state.creationLists.concat(res.data);
        console.log('###########');
        this.setState({
          total: res.total,
          isLoadingTail: false,
          creationLists: list,
          page: this.state.page + 1,
          dataSource: this.ds.cloneWithRows(list)
        });
        console.log('????', this.state);
        console.log('creationLists 上滑', list);
      }
      else {  //下拉刷新
        console.log('下拉刷新啦');
        let list = res.data.concat(this.state.creationLists);
        this.setState({
          total: res.total,
          isRefreshing: false,
          creationLists: list,
          dataSource: this.ds.cloneWithRows(list)
        });
        console.log('creationLists 下拉', list);
      }

    }).catch(error => {
      if (page !== -1) {
        this.setState({
          isLoading: false
        });
      } else {
        this.setState({
          isRefreshing: false
        });
      }

      throw error;
    });
    // }, 2000);

  }

  /**
   * 是否还有更多数据
   * @return {boolean}
   * @private
   */
  static _hasMore() {
    let creationCount = this.state.creationLists.length;
    let creationTotal = this.state.total;
    // console.log('creationCount', creationCount);
    // console.log('creationTotal', creationTotal);
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
          <View style={styles.loadingFooter}>
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
        <ActivityIndicator style={styles.loadingFooter}/>
    );
  }

  static _renderHeader() {
    if (!List._hasMore.call(this) && this.state.creationLists.length) {
      // 数据没有更多的时候
      return (
          <View style={styles.loadingMore}>
            <Text style={styles.loadingText}>
              已经是最新了
            </Text>
          </View>
      );
    }
  }

  static _onRefresh() {
    if (this.state.isRefreshing || !List._hasMore.call(this)) return;

    List._fetchData.call(this, -1);
  }

  render() {
    console.log('render start', this.state);
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
              renderHeader={List._renderHeader.bind(this)}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={List._onRefresh.bind(this)}
                    tintColor="#ff6600"
                    title="拼命加载中"
                />
              }
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