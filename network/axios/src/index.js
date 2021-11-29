import axios from 'axios';

// const myi = axios.interceptors.request.use(
//   function (config) {
//     console.log(config);
//     console.log("before request");
//   },
//   function (error) {
//     console.log(error);
//     console.log("before request");
//   }
// );

// axios.interceptors.response.use(
//   function (res) {
//     console.log(res);
//     console.log("after request");
//   },
//   function (error) {
//     console.log(error);
//     console.log("after request");
//   }
// );

const cancelToken = axios.CancelToken;
const source = cancelToken.source();

axios
  .get('http://localhost:3000/', {
    cancelToken: source.token,
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

axios
  .post(
    'http://localhost:3000/receive',
    {
      name: 'leo',
    },
    {
      cancelToken: source.token,
    }
  )
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
source.cancel('不想请求了');

const a = [];
const ful = '1';
const reject = '2';
a.unshift(ful, reject);
a;

function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

isAbsoluteURL('asdasd/asdasd');
