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

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  /*视频操作*/
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
      playing: true,
      currentTime: currentTime,
      videoProgress: progress,
      videoTotal: playableDuration,
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

  static _jumpTo(e) {
    console.log('jumpTo');
    // console.log(e.nativeEvent);
    let {locationX} = e.nativeEvent;  //获元素取点击位置的横坐标
    console.log(locationX);
    let percent = locationX / screenWidth;  //点击位置的进度条比例
    let jumpTime = percent * this.state.videoTotal; //对应比例处的视频时间
    this.refs.videoPlayer.seek(jumpTime); //视频跳转到对应时间
    this.setState({
      // paused: false,    //视频取消暂停
    });
  }

  render() {
    return (
      <View style={styles.videoContainer}>
        <View style={styles.videoBox}>
          <Video
            ref='videoPlayer'
            source={{uri: this.props.uri}}  //视频地址
            style={styles.video}
            volume={1}  //声音放大倍数
            paused={this.state.paused}  //视频刚开始是否暂停
            rate={this.state.rate}    //视频播放时候的速度
            muted={this.state.muted}  //视频是否静音
            resizeMode={this.state.resizeMode}  //视频的拉伸方式
            repeat={this.state.repeat}

            //回调函数
            onLoadStart={VideoPlayer._onLoadStart.bind(this)} //视频开始加载
            onLoad={VideoPlayer._onLoad.bind(this)} //视频加载中
            onProgress={VideoPlayer._onProgress.bind(this)} //视频在播放中，每隔 250ms 调用该函数，会带上当前已播放时间作为参数
            onEnd={VideoPlayer._onEnd.bind(this)} //播放结束
            onError={VideoPlayer._onError.bind(this)} //视频出错
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
              <TouchableOpacity style={styles._pauseBtn} activeOpacity={1} onPress={VideoPlayer._pause.bind(this)}>
                {
                  this.state.paused ?
                    <Icon
                      name='ios-play'
                      style={styles.playIcon}
                      size={40}
                      onPress={VideoPlayer._resume.bind(this)}
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
                onPress={VideoPlayer._replay.bind(this)}
              /> : null
          }

          {
            /*视频进度条*/
            <View style={styles.progressBox}>
              <View style={[styles.progressBar, {width: screenWidth * this.state.videoProgress}]}/>
              <TouchableOpacity ref='jumpBar' style={styles.jumpBar} onPress={VideoPlayer._jumpTo.bind(this)}>

              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    );
  }

}


const styles = StyleSheet.create({
  videoBox: {
    width: screenWidth,
    height: screenWidth * 0.5625,
    backgroundColor: '#000',
    marginBottom: 10,
  },
  video: {
    width: screenWidth,
    height: screenWidth * 0.5625,
    backgroundColor: '#000',
  },
  videoFail: {
    position: 'absolute',
    color: '#ddd',
    top: 120,
    left: 0,
    width: screenWidth,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  onLoading: {
    position: 'absolute',
    top: 60,
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
  jumpBar: {
    position: 'absolute',
    top: -2,
    left: 0,
    width: screenWidth,
    height: 7,
    // borderWidth: 1,
    // borderColor: '#f00'
  },
  playIcon: {
    position: 'absolute',
    top: 80,
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
    height: screenWidth * 0.5625,
    left: 0,
    top: 0,
  },
});
