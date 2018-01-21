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

let {CountDownText} = require('react-native-sk-countdown'); //倒计时模块

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      verifyCode: '',
      countingDone: false,
      codeSent: false
    };
  }

  static _savePhone(text) {
    this.setState({
      phoneNumber: text,
    });
  }

  static _saveVerify(text) {
    this.setState({
      verifyCode: text,
    });
  }

  /**
   * 提交手机号和验证码
   * @private
   */
  static _submit() {
    let {phoneNumber, verifyCode} = this.state;
    if (!phoneNumber || !verifyCode) {
      AlertIOS.alert('手机号或验证码不能为空');
      return;
    }
    let body = {
      phoneNumber,
      verifyCode,
    };
    request.post(url.verify, body).then(res => {
      if (res && res.success) {
        /*登录成功*/
        console.log('login ok');
        console.log(res);
        this.props.afterLogin.call(this, res.data);
      } else {
        AlertIOS.alert('获取验证码失败，请检查手机号');
      }
    }).catch(err => {
      console.log(err);
      AlertIOS.alert('获取验证码失败，请稍后再试');
    });
  }

  /**
   * 提交手机号获取验证码
   * @private
   */
  static _sendVerifyCode() {
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

  /**
   * 显示验证码
   * @private
   */
  static _showVerifyCode() {
    this.setState({
      codeSent: true,
      countingDone: false,
    });
  }

  /**
   * 显示倒计时
   * @private
   */
  static _countingDone(){
    this.setState({
      countingDone: true,
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
              <View style={styles.verifyCodeBox}>
                <TextInput
                  style={styles.inputField}
                  placeholder={'输入验证码'}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  keyboardType={'numeric'}
                  onChangeText={Login._saveVerify.bind(this)}
                  autoFocus={true}
                />

                {
                  this.state.countingDone
                    ? <Button
                      style={styles.countBtn}
                      onPress={Login._sendVerifyCode.bind(this)}
                    >
                      获取验证码
                    </Button>
                    : <CountDownText
                      style={styles.countBtn}
                      countType='seconds' // 计时类型：seconds / date
                      auto={true} // 自动开始
                      afterEnd={Login._countingDone.bind(this)} // 结束回调
                      timeLeft={10} // 正向计时 时间起点为0秒
                      step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                      startText='获取验证码' // 开始的文本
                      endText='获取验证码' // 结束的文本
                      intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
                    />
                }

              </View> : null
          }

          {
            this.state.codeSent
              ? <Button style={styles.btn} onPress={Login._submit.bind(this)}>登录</Button>
              : <Button style={styles.btn} onPress={Login._sendVerifyCode.bind(this)}>获取验证码</Button>
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

  verifyCodeBox:{
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    backgroundColor: '#ee735c',
    borderColor: '#ee735c',
    color: '#fff',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 15,
    borderRadius: 2,
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
