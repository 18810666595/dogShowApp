import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  AlertIOS,
} from 'react-native';

import Button from 'react-native-button';
import request from '../common/request';
import url from '../common/url';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      verifyCode: '',
      codeSent: false
    };
  }

  static _savePhone(text) {
    this.setState({
      phoneNumber: text,
    });
  }

  static _saveVerify(text){
    this.setState({
      verifyCode: text,
    })
  }

  static _submit() {

  }

  static _sendVerifyCodes() {
    let phoneNumber = this.state.phoneNumber;
    if (!phoneNumber) {
      AlertIOS.alert('手机号不能为空');
      return;
    }
    let body = {
      phoneNumber,
    };
    request.post(url.signup, body).then(res => {
      if (res && res.success) {
        Login._showVerifyCode.call(this);
      } else {
        AlertIOS.alert('获取验证码失败，请检查手机号');
      }
    }).catch(err => {
      console.log(err);
      AlertIOS.alert('获取验证码失败，请稍后再试');
    });


  }

  static _showVerifyCode() {
    this.setState({
      codeSent: true,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput
            style={styles.inputField}
            placeholder={'输入手机号'}
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType={'numeric'}
            onChangeText={Login._savePhone.bind(this)}
            autoFocus={true}
          />

          {
            this.state.codeSent ?
              <View>
                <TextInput
                  style={styles.inputField}
                  placeholder={'输入验证码'}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  keyboardType={'numeric'}
                  onChangeText={Login._saveVerify.bind(this)}
                  autoFocus={true}
                />
              </View> : null

          }

          {
            this.state.codeSent
              ? <Button style={styles.btn} onPress={Login._submit.bind(this)}>登录</Button>
              : <Button style={styles.btn} onPress={Login._sendVerifyCodes.bind(this)}>获取验证码</Button>
          }
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },

  signupBox: {
    marginTop: 30,
  },

  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center',
  },

  inputField: {
    flex: 1,
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4
  },

  btn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee735c',
  }

});
