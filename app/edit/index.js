import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import VideoPlayer from '../components/VideoPlayer';

const screenWidth = Dimensions.get('window').width;

export default class Edit extends Component {
  constructor(props) {
    super(props);
    // let user = this.props.user || {};
    this.state = {
      previewVideo: null,

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

  static _getQiniuToken() {

  }

  static _pickVideo() {
    /*ImagePicker 的配置 options*/
    let options = {
      title: '选择视频',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '录制10秒视频',
      chooseFromLibraryButtonTitle: '选择已有视频',
      videoQuality: 'medium',
      mediaType: 'video',
      durationLimit: 10,
      noData: false,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }

      else {
        // You can display the image using either data...
        const videoUri = response.uri;

        this.setState({
          previewVideo: videoUri,
        });
        // Edit._getQiniuToken.call(this)
        //   .then(res => {
        //     console.log('res', res);
        //     if (res && res.success) {
        //       let token = res.data.token; //获取签名
        //       let key = res.data.key; //获取 key
        //
        //       /*构建 post 到七牛的 form 数据 */
        //       let body = new FormData();
        //       body.append('token', token);
        //       body.append('key', key);
        //       body.append('file', {
        //         type: 'image/png',
        //         uri: source.uri,
        //         name: key,
        //       });
        //       console.log('hear');
        //       Account._upload.call(this, body);
        //     }
        //   });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>
            {this.state.previewVideo ? '点击按钮进行配音' : '视频配音'}
          </Text>
          <Text style={styles.toolbarExtra} onPress={Edit._pickVideo.bind(this)}>更换视频</Text>
        </View>

        <View style={styles.page}>
          {
            this.state.previewVideo
              ?
              <VideoPlayer uri={this.state.previewVideo}/>
              :
              <TouchableOpacity style={styles.uploadContainer} onPress={Edit._pickVideo.bind(this)} activeOpacity={1}>
                <View style={styles.uploadBox}>
                  <Image source={require('../assets/images/record.jpeg')}/>
                  <Text style={styles.uploadTitle}>点我上传视频</Text>
                  <Text style={styles.uploadDesc}>建议时长不超过10秒</Text>
                </View>
              </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  toolbar: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c',
  },

  toolbarTitle: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },

  toolbarExtra: {
    position: 'absolute',
    right: 10,
    top: 26,
    width: 80,
    height: 40,
    color: '#fff',
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 14,
  },

  page: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5fcff'
  },

  uploadContainer: {
    marginTop: 90,
    width: screenWidth - 40,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#ee735c',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#fff',
  },

  uploadBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadTitle: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },

  uploadDesc: {
    color: '#999',
    textAlign: 'center',
    fontSize: 12,
  },

  uploadIcon: {
    width: 110,
    resizeMode: 'contain',
  },

  videoContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

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