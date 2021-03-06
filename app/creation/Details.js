import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ListView,
  Image,
  TextInput,
  Modal,
  AlertIOS,
} from 'react-native';

import Button from 'react-native-button';
import VideoPlayer from '../components/VideoPlayer';
import Icon from 'react-native-vector-icons/Ionicons';
import request from "../common/request";
import url from '../common/url';


const screenWidth = Dimensions.get('window').width; //获取屏幕的宽度
// console.log('Video', Video);

export default class Details extends Component {
  constructor(props) {
    super(props);
    let params = this.props.params;
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.ds = ds;
    this.state = {
      isLoadingTail: false, //是否加载评论中
      data: params.data,

      // video load
      videoReady: false,
      videoProgress: 0,
      videoTotal: 0,
      currentTime: 0,
      videoOK: true,
      playing: false,
      paused: true,

      // video player
      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false,

      // comments 列表
      dataSource: ds.cloneWithRows([]),
      page: 0,
      total: 0,
      commentList: [],

      // modal
      modalVisiable: false,
      animationType: 'none',
      content: '',
      isSending: false,
    };
  }

  static _back() {
    this.props.navigator.pop();
  }

  /*列表操作*/
  static renderRow(row) {
    return (
      <View style={styles.replyBox} key={row._id}>
        <Image style={styles.replyAvatar} source={{uri: row.replyAvatar}}/>
        <View style={styles.reply}>
          <Text style={styles.replyName}>{row.replyName}</Text>
          <Text style={styles.replyMsg} numberOfLines={2}>{row.replyMsg}</Text>
        </View>
      </View>
    );
  }

  static fetchComment(page) {
    let _id = this.state.data._id;
    this.setState({
      isLoadingTail: true,
    });

    request.get(url.comment, {
      id: _id,
      accessToken: '123',
      page: page,
    }).then(res => {
      // setTimeout(()=>{
      this.setState({
        isLoadingTail: false,
      });

      if (res && res.success) {
        let comments = res.comments;
        let commentList = this.state.commentList.concat(comments);
        if (comments && comments.length) {
          console.log('comment', comments);
          this.setState({
            commentList: commentList,
            dataSource: this.ds.cloneWithRows(commentList),
            page: this.state.page + 1,
            total: res.total
          });
        }
      }
      // },5000);

    });
  }

  static _hasMore() {
    let commentCount = this.state.commentList.length;
    let commentTotal = this.state.total;
    // console.log('creationCount', creationCount);
    // console.log('creationTotal', creationTotal);
    return commentCount < commentTotal;
  }

  static _focus() {
    Details._setModalVisiable.call(this, true);
  }

  static _renderHeader() {
    let author = this.state.data.author;
    return (
      <View style={styles.listHeader}>
        <View style={styles.infoBox}>
          <Image style={styles.authorImg} source={{uri: author.avatar}}/>
          <View style={styles.descBox}>
            <Text style={styles.authorName}>{author.name}</Text>
            <Text style={styles.authorMsg} numberOfLines={2}>{author.message}</Text>
          </View>
        </View>
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput
              placeholder={'敢不敢评论一个'}
              style={styles.content}
              multiline={true}
              onFocus={Details._focus.bind(this)}
              defaultValue={this.state.content}
              onChangeText={Details._changeText.bind(this)}
            />

          </View>
        </View>
        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>精彩评论</Text>
        </View>
      </View>

    );
  }

  static _renderFooter() {
    if (!Details._hasMore.call(this) && this.state.commentList.length) {
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

  static _fetchMoreComment() {
    if (!Details._hasMore.call(this) || this.state.isLoadingTail) return;

    console.log('开始获取更多数据啦');
    let page = this.state.page;
    Details.fetchComment.call(this, page);
  }

  static _closeModal() {
    Details._setModalVisiable.call(this, false);
  }

  static _setModalVisiable(isVisiable) {
    this.setState({
      modalVisiable: isVisiable
    });
  }

  static _changeText(text) {
    this.setState({
      content: text,
    });
  }

  static _submit() {
    if (!this.state.content) {
      AlertIOS.alert('评论不能为空');
      return;
    }

    if (this.state.isSending) {
      AlertIOS.alert('正在评论中');
      return;
    }

    this.setState({
      isSending: true,
    }, () => {
      let body = {
        accessToken: '1234',
        id: this.state.data._id,
        content: this.state.content
      };
      request.post(url.submitComment, body).then(res => {
        if (res && res.success) {
          // console.log('%%%', res);
          // console.log('###', this.state.commentList);
          let myComment = res.comment;
          let item = {
            _id: myComment.id,
            replyName: myComment.replyName,
            replyAvatar: myComment.replyAvatar,
            replyMsg: this.state.content,
          };
          let newCommentList = [item].concat(this.state.commentList);
          this.setState({
            isSending: false,
            commentList: newCommentList,
            dataSource: this.ds.cloneWithRows(newCommentList),
            modalVisiable: false,
            content: ''
          });
        }
      }).catch(error => {
        console.log(error);
        this.setState({
          isSending: false
        });
        AlertIOS.alert('评论失败，稍后再试');
      });
    });
  }

  componentDidMount() {
    // console.log('hear');
    // console.log(this.state.data);
    let page = this.state.page;
    Details.fetchComment.call(this, page);
  }

  render() {
    let data = this.state.data;
    // console.log('data', data);
    // console.log('row####', row);
    // console.log('this.props', this.props);
    return (
      <View style={styles.container}>

        {/*视频头部区域*/}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBox} onPress={Details._back.bind(this)}>
            <Icon name={'ios-arrow-back'} size={18} style={styles.backIcon}/>
            <Text>返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{data.title}</Text>
        </View>

        {/*视频区域*/}
        <VideoPlayer uri={data.video}/>

        {/*评论区域*/}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={Details.renderRow.bind(this)}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          onEndReached={Details._fetchMoreComment.bind(this)}
          onEndReachedThreshold={20}
          renderFooter={Details._renderFooter.bind(this)}
          renderHeader={Details._renderHeader.bind(this)}
          showsVerticalScrollIndicator={false}
        />

        <Modal
          animationType={'slide'}
          visible={this.state.modalVisiable}
          onRequestClose={Details._setModalVisiable.bind(this, false)}
        >
          <View style={styles.modalContainer}>
            <Icon
              style={styles.closeIcon}
              name={'ios-close-outline'}
              onPress={Details._closeModal.bind(this)}
              // size={30}
            />
            <View style={styles.commentBox}>
              <View style={styles.comment}>
                <TextInput
                  placeholder={'敢不敢评论一个'}
                  style={styles.contentInModal}
                  multiline={true}
                  defaultValue={this.state.content}
                  onChangeText={Details._changeText.bind(this)}
                  autoFocus={true}
                />

              </View>
            </View>
            <Button
              style={styles.submitBtn}
              onPress={Details._submit.bind(this)}
            >
              评论
            </Button>
          </View>

        </Modal>


      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    backgroundColor: '#fff',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
    marginTop: 30,
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  backBox: {
    backgroundColor: '#f9e66f',
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    width: 60,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  backIcon: {
    color: '#785348',
    fontSize: 18,
    marginRight: 5,
  },
  headerTitle: {
    // backgroundColor: 'red',
    width: screenWidth - 150,
    textAlign: 'center',
    fontSize: 18,
  },
  infoBox: {
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: 'blue'
  },
  authorImg: {
    width: 60,
    height: 60,
    marginRight: 10,
    // marginLeft: 10,
    borderRadius: 30,
  },
  descBox: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'green'
  },
  authorName: {
    fontSize: 18,
  },
  authorMsg: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  replyBox: {
    width: screenWidth,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginTop: 10,
    // borderWidth: 1,
    // borderColor: 'blue'
  },
  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    // marginLeft: 10,
    borderRadius: 20,
  },
  reply: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'green'
  },
  replyName: {
    fontSize: 14,
  },
  replyMsg: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
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
  },
  listHeader: {
    width: screenWidth,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    // borderColor: 'red',
    // borderWidth: 1,
  },
  commentBox: {
    // marginTop: 10,
    // marginBottom: 10,
    width: screenWidth,
    padding: 10,
    // borderWidth: 1,
    // borderColor: 'blue',
  },
  content: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingLeft: 8,
    color: '#333',
    height: 40,
    backgroundColor: '#fff',
    fontSize: 14,
    borderRadius: 4,
  },
  commentArea: {
    // width: screenWidth,
    // paddingBottom: 6,
    // borderBottomWidth: 1,
    paddingBottom: 10,
    paddingLeft: 10,
    // borderColor: '#333',
  },
  modalContainer: {
    // borderWidth: 3,
    // borderColor: 'red',
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
  },
  closeIcon: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#ee753c',
  },
  contentInModal: {
    // width: screenWidth,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingLeft: 8,
    color: '#333',
    height: 400,
    backgroundColor: '#fff',
    fontSize: 14,
    borderRadius: 4,
  },
  submitBtn: {
    width: screenWidth - 20,
    padding: 16,
    marginVertical: 20,
    // marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ee735c',
    borderRadius: 4,
    color: '#ee735c',
    fontSize: 18,
  },

});
