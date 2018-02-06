/**
 * 用于post请求中的header
 */

export default {
  header: {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  },
  qiniu: {
    upload: 'http://upload-z1.qiniu.com',
    base: 'http://p3q6ot0oj.bkt.clouddn.com',
  },
  CLOUDINARY: {
    cloud_name: 'chengong',
    api_key: '762542723573819',
    // api_secret: 'N0UgAw9s2mklHayQCm4UxrHzoeQ',
    base: 'http://res.cloudinary.com/chengong',
    image: 'https://api.cloudinary.com/v1_1/chengong/image/upload',
    video: 'https://api.cloudinary.com/v1_1/chengong/video/upload',
    audio: 'https://api.cloudinary.com/v1_1/chengong/raw/upload',
  }
}
;