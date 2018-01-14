import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width; //获取屏幕的宽度
// console.log('Video', Video);

export default class Details extends Component {
  constructor(props) {
    super(props);
    let params = this.props.params;
    this.state = {
      data: params.data,
      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false,
      videoReady: false,
      videoProgress: 0,
      videoTotal: 0,
      currentTime: 0,
      videoOK: true,
      playing: false,
      paused: true,
    };
  }

  static _back() {
    this.props.navigator.pop();
  }

  // componentWillReceiveProps(nextProps){
  //   this.setState({
  //     params: nextProps.params
  //   })
  // }

  static _onLoadStart() {
    console.log('_onLoadStart');
  }

  static _onLoad() {
    console.log('_onLoad');
    if (!this.state.videoReady) {
      this.setState({
        videoReady: true,
        playing: true,
      });
    }
  }

  static _onProgress(data) {


    let {playableDuration, currentTime} = data;
    let progress = (currentTime / playableDuration).toFixed(3);
    // console.log(data);
    // console.log('_onProgress', progress);
    this.setState({
      videoTotal: playableDuration,
      currentTime: currentTime,
      videoProgress: progress,
    });
  }

  static _onEnd() {
    this.setState({
      playing: false,
      videoProgress: 1,
    });
    console.log('_onEnd');
  }

  static _onError(e) {
    this.setState({
      videoOK: false,
    });

    console.log(e);
    console.log('_onError');
  }

  static _replay() {
    this.refs.videoPlayer.seek(0);  //视频重新播放
  }

  static _pause() {
    if (!this.state.paused) {
      this.setState({
        paused: true,
      });
    }
  }

  static _resume() {
    if (this.state.paused) {
      this.setState({
        paused: false,
      });
    }
  }

  render() {
    let data = this.state.data;
    // console.log('data', data);
    // console.log('row####', row);
    // console.log('this.props', this.props);
    return (
        <View style={styles.container}>
          <Text onPress={Details._back.bind(this)}>
            详情页面
          </Text>
          <View style={styles.videoBox}>
            <Video
                ref='videoPlayer'
                source={{uri: data.video}}  //视频地址
                style={styles.video}
                volume={1}  //声音放大倍数
                paused={this.state.paused}  //视频刚开始是否暂停
                rate={this.state.rate}    //视频播放时候的速度
                muted={this.state.muted}  //视频是否静音
                resizeMode={this.state.resizeMode}  //视频的拉伸方式
                repeat={this.state.repeat}

                //回调函数
                onLoadStart={Details._onLoadStart.bind(this)} //视频开始加载
                onLoad={Details._onLoad.bind(this)} //视频加载中
                onProgress={Details._onProgress.bind(this)} //视频在播放中，每隔 250ms 调用该函数，会带上当前已播放时间作为参数
                onEnd={Details._onEnd.bind(this)} //播放结束
                onError={Details._onError.bind(this)} //视频出错
            />

            {
              /*视频出错提示*/
              !this.state.videoOK && <Text style={styles.videoFail}>视频出错了，非常抱歉</Text>
            }

            {
              /*视频加载 loading 图标*/
              !this.state.videoReady && <ActivityIndicator size='large' color='#ee735c' style={styles.onLoading}/>
            }

            {
              /*视频暂停、播放功能*/
              this.state.videoReady && this.state.playing ?
                  <TouchableOpacity style={styles._pauseBtn} activeOpacity={1} onPress={Details._pause.bind(this)}>
                    {
                      this.state.paused ?
                          <Icon
                              name='ios-play'
                              style={styles.playIcon}
                              size={40}
                              onPress={Details._resume.bind(this)}
                          /> : null
                    }
                  </TouchableOpacity> : null
            }

            {
              /*视频重新播放*/
              this.state.videoReady && !this.state.playing ?
                  <Icon
                      name='ios-play'
                      style={styles.playIcon}
                      size={40}
                      onPress={Details._replay.bind(this)}
                  /> : null
            }

            {
              /*视频进度条*/
              <View style={styles.progressBox}>
                <View style={[styles.progressBar, {width: screenWidth * this.state.videoProgress}]}/>
              </View>
            }
          </View>

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
  videoBox: {
    width: screenWidth,
    height: 360,
    backgroundColor: '#000',
  },
  video: {
    width: screenWidth,
    height: 360,
    backgroundColor: '#000',
  },
  videoFail: {
    position: 'absolute',
    color: '#ddd',
    top: 230,
    left: 0,
    width: screenWidth,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  onLoading: {
    position: 'absolute',
    top: 180,
    left: 0,
    width: screenWidth,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
  progressBox: {
    width: screenWidth,
    height: 3,
    backgroundColor: '#333',
  },
  progressBar: {
    width: 1,
    height: 3,
    backgroundColor: '#ee735c'
  },
  playIcon: {
    position: 'absolute',
    top: 150,
    right: screenWidth / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 10,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66',
  },
  _pauseBtn: {
    position: 'absolute',
    width: screenWidth,
    height: 360,
    left: 0,
    top: 0,
  }
});