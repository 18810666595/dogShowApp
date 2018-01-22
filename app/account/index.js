import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
import ImagePicker from 'react-native-image-picker';

export default class Account extends Component {
  constructor(props) {
    super(props);
    let user = this.props.user || {};
    this.state = {
      user,
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    AsyncStorage.getItem('user').then(data => {
      // console.log('data', data);
      if (data) {
        let user = JSON.parse(data);
        if (user && user.accessToken) {
          this.setState({
            user,
          });
        }
      }
    });
  }

  static _pickPhoto() {
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
        let user = this.state.user;
        user.avatar = source.uri; //source 是一个对象
        AsyncStorage.setItem('user', JSON.stringify(user)).then(()=>{
          this.setState({
            user: user
          })
        })
      }
    });
  }

  render() {
    let user = this.state.user;

    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的账户</Text>
        </View>

        {
          user.avatar
            ?
            <TouchableOpacity onPress={Account._pickPhoto.bind(this)} style={styles.avatarContainer}>
              <Image source={{uri: user.avatar}} style={styles.avatarContainer}>
                <View style={styles.avatarBox}>
                  <Image source={{uri: user.avatar}} style={styles.avatar}/>
                </View>
                <Text style={styles.avatarTip}>更换头像</Text>
              </Image>
            </TouchableOpacity>
            :
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarTip}>添加头像</Text>
              <TouchableOpacity style={styles.avatarBox}>
                <Icon style={styles.uploadIcon} name={'ios-cloud-upload-outline'} size={32}/>
              </TouchableOpacity>
            </View>
        }


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
  }


});