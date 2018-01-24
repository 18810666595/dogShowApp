import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  AsyncStorage,
  AlertIOS,
  Modal,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import Button from 'react-native-button';

const screenWidth = Dimensions.get('window').width;
import ImagePicker from 'react-native-image-picker';
import request from '../common/request';
import url from '../common/url';
import sha1 from 'sha1';
import axios from 'axios';


const CLOUDINARY = {
  cloud_name: 'chengong',
  api_key: '762542723573819',
  api_secret: 'N0UgAw9s2mklHayQCm4UxrHzoeQ',
  base: 'http://res.cloudinary.com/chengong',
  image: 'https://api.cloudinary.com/v1_1/chengong/image/upload',
  video: 'https://api.cloudinary.com/v1_1/chengong/video/upload',
  audio: 'https://api.cloudinary.com/v1_1/chengong/raw/upload',

};

// function avatar(id, type) {
//   return `${CLOUDINARY.base}/${type}/upload/${id}`;
// }

export default class Account extends Component {
  constructor(props) {
    super(props);
    let user = this.props.user || {};
    this.state = {
      user,
      avatarProgress: 0,
      avatarUploading: false,
      modalVisiable: false,
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    AsyncStorage.getItem('user').then(data => {
      // console.log('data', data);
      if (data) {
        let user = JSON.parse(data);
        // user.avatar = '';
        if (user && user.accessToken) {
          this.setState({
            user,
          });
        }
      }
    });
  }

  static _pickPhoto() {
    /*ImagePicker 的配置 options*/
    let options = {
      title: '选择头像',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择相册',
      allowsEditing: true,
      quality: 0.75,
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
        const source = {uri: 'data:image/png;base64,' + response.data, isStatic: true};
        console.log('source', source);
        // let user = this.state.user;
        // user.avatar = source.uri; //source 是一个对象
        // AsyncStorage.setItem('user', JSON.stringify(user)).then(() => {
        //   this.setState({
        //     user: user
        //   });
        // });

        /*构造 cloudinary 所需params*/
        let timestamp = Date.now();
        let tags = 'app,avatar';
        let folder = 'avatar';
        let {accessToken,} = this.state.user;

        /*向自己的服务器发送请求*/
        request.post(url.signatureURL, {
          accessToken,
          timestamp,
          type: 'avatar',
          folder,
          tags,
        }).then(res => {
          if (res && res.success) {
            /*下面是本地伪造签名，之后会在服务器端生成签名，这是为了先跑通流程*/
            let signatureStr = `folder=${folder}&tags=${tags}&timestamp=${timestamp}${CLOUDINARY.api_secret}`;
            let signature = sha1(signatureStr);

            /*构建 post 到 cloudinary 的 form 数据 */
            let body = new FormData();
            body.append('folder', folder);
            body.append('signature', signature);
            body.append('tags', tags);
            body.append('api_key', CLOUDINARY.api_key);
            body.append('resource', 'image');
            body.append('file', source.uri);
            body.append('timestamp', timestamp);

            Account._upload.call(this, body);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    });
  }

  /**
   * 使用 axios 上传数据到 cloudinary
   * @param body
   * @private
   */
  static _upload(body) {
    let that = this;
    console.log('body', body);
    this.setState({
      avatarProgress: 0,
      avatarUploading: true,
    });

    axios.post(CLOUDINARY.image, body, {
      onUploadProgress(progressEvent) {
        // console.log('progressEvent', progressEvent);
        if (progressEvent.lengthComputable) {
          let {loaded, total} = progressEvent;
          let percent = Number((loaded / total).toFixed(2));
          console.log('percent', percent);
          that.setState({
            avatarProgress: percent,
          });
        }
      }
    }).then(res => {
      console.log('res', res);
      if (res && res.data.public_id) {
        let user = this.state.user;
        // user.avatar = avatar(res.data.public_id, 'image');
        user.avatar = res.data.secure_url;
        console.log('user.avatar', user.avatar);
        this.setState({
          user,
          avatarUploading: false,
          avatarProgress: 0,
        });
        Account._asyncUser.call(this, user);  //同步更新的数据到服务器
      }
    }).catch(err => {
      console.log(err);
      AlertIOS.alert('请求失败');
    });
  }

  static _asyncUser(user) {
    console.log('hear', user);
    if (user && user.accessToken) {
      request.post(url.update, user).then(res => {
        if (res && res.success) {
          let userUpdate = res.data;
          console.log('userUpdate', userUpdate);
          this.setState({
            user: userUpdate,
          }, () => {
            Account._closeModal.call(this);
            AsyncStorage.setItem('user', JSON.stringify(userUpdate));
          });
        }
      });
    }
  }

  ///*使用 xhr 上传数据到 cloudinary*/
  // static _upload(body) {
  //   let xhr = new XMLHttpRequest();
  //   let url = CLOUDINARY.image;
  //   xhr.open('POST', url);
  //   xhr.send(body);
  //   xhr.onload = () => {
  //     if (xhr.status !== 200) {
  //       AlertIOS.alert('请求失败');
  //       console.log(xhr.responseText);
  //       return;
  //     }
  //     if (!xhr.responseText) {
  //       AlertIOS.alert('请求失败');
  //       return;
  //     }
  //     let response;
  //     try {
  //       response = JSON.parse(xhr.responseText);
  //     } catch (e) {
  //       console.log(e);
  //       console.log('parse fails');
  //     }
  //
  //     if (response && response.public_id) {
  //       let user = this.state.user;
  //       user.avatar = avatar(response.public_id, 'image');
  //       this.setState({
  //         user,
  //       });
  //     }
  //   };
  // }

  static _edit() {
    this.setState({
      modalVisiable: true,
    });
  }

  static _closeModal() {
    this.setState({
      modalVisiable: false,
    });
  }

  static _changeUserState(key, value) {
    let {user} = this.state;
    user[key] = value;
    this.setState({
      user,
    });
  }

  static _logout() {
    this.props.logout.call(this);
  }

  render() {
    let user = this.state.user;

    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的账户</Text>
          <Text style={styles.toolbarExtra} onPress={Account._edit.bind(this)}>编辑</Text>
        </View>

        {
          user.avatar
            ?
            <TouchableOpacity onPress={Account._pickPhoto.bind(this)} style={styles.avatarContainer}>
              <Image source={{uri: user.avatar}} style={styles.avatarContainer}>
                <View style={styles.avatarBox}>
                  {
                    this.state.avatarUploading
                      ? <Progress.Circle size={70} showsText={true} color={'#ee735c'} progress={this.state.avatarProgress}/>
                      : <Image source={{uri: user.avatar}} style={styles.avatar}/>
                  }
                </View>
                <Text style={styles.avatarTip}>更换头像</Text>
              </Image>
            </TouchableOpacity>
            :
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarTip}>添加头像</Text>
              <TouchableOpacity onPress={Account._pickPhoto.bind(this)} style={styles.avatarBox}>
                {
                  this.state.avatarUploading
                    ? <Progress.Circle size={70} showsText={true} color={'#ee735c'} progress={this.state.avatarProgress}/>
                    : <Icon style={styles.uploadIcon} name={'ios-cloud-upload-outline'} size={32}/>
                }

              </TouchableOpacity>
            </View>
        }

        <Modal animationType={'slide'} visible={this.state.modalVisiable}>
          <View style={styles.modalContainer}>
            <Icon name={'ios-close-outline'}
                  style={styles.closeIcon}
                  size={50}
                  onPress={Account._closeModal.bind(this)}/>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>昵称</Text>
              <TextInput style={styles.inputField}
                         placeholder={'输入你的名字'}
                         autoCapitalize={'none'}
                         autoCorrect={false}
                         defaultValue={user.nickname}
                         onChangeText={(text) => {
                           Account._changeUserState.call(this, 'nickname', text);
                         }}/>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.label}>年龄</Text>
              <TextInput style={styles.inputField}
                         placeholder={'输入你的年龄'}
                         autoCapitalize={'none'}
                         autoCorrect={false}
                         defaultValue={user.age}
                         onChangeText={(text) => {
                           Account._changeUserState.call(this, 'age', text);
                         }}/>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.label}>性别</Text>
              <Icon.Button
                style={[styles.gender, user.gender === 'male' && styles.genderChecked]}
                name={'ios-paw'}
                onPress={Account._changeUserState.bind(this, 'gender', 'male')}
              >男</Icon.Button>
              <Icon.Button
                style={[styles.gender, user.gender === 'female' && styles.genderChecked]}
                name={'ios-paw-outline'}
                onPress={Account._changeUserState.bind(this, 'gender', 'female')}
              >女</Icon.Button>
            </View>

            <Button style={styles.btn} onPress={Account._asyncUser.bind(this, user)}>保存</Button>
          </View>
        </Modal>

        <Button style={styles.btn} onPress={Account._logout.bind(this, user)}>退出</Button>

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
    width: 40,
    height: 40,
    color: '#fff',
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 14,
  },

  avatarContainer: {
    width: screenWidth,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666',
  },

  avatarBox: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },

  avatarTip: {
    color: '#fff',
    backgroundColor: 'transparent',
    fontSize: 14,
  },

  avatar: {
    marginBottom: 15,
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    borderRadius: screenWidth * 0.1,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc'
  },

  uploadIcon: {
    padding: 20,
    paddingHorizontal: 25,
    color: '#999',
    backgroundColor: '#fff',
  },

  modalContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },

  closeIcon: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    textAlign: 'right',
    top: 30,
    color: '#ee735c',
  },

  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    // paddingLeft: 15,
    // paddingRight: 15,
    marginTop: 20,
    borderColor: '#eee',
    borderBottomWidth: 1,
  },

  label: {
    color: '#ccc',
    marginRight: 10,
  },

  inputField: {
    flex: 1,
    height: 50,
    color: '#666',
    fontSize: 14,
  },

  gender: {
    backgroundColor: '#999',
  },

  genderChecked: {
    backgroundColor: '#ee735c',
  },

  btn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee735c',
  }

});