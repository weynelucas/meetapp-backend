import { createGlobalStyle } from 'styled-components';

import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap');

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    border: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    background: linear-gradient(180deg, #22202C 0%, #402845 100%);
    -webkit-font-smoothing: antialiased !important;
  }
  
  body, input, textarea, button, .Toastify__toast-body {
    color: #fff;
    font-size: 14px;
    font-family: 'Open Sans', Helvetica, sans-serif;
  }

  ol, ul {
    list-style: none;
  }

  button {
    cursor: pointer;
  }

  a {
    text-decoration: none;
  }

  .Toastify__toast {
    border-radius: 4px !important;
  }

  .Toastify__toast-body {
    font-size: 16px;
  }
`;
