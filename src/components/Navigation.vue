<!-- Navigation.vue -->
<template>
    <nav>
      <ul>
        <li><router-link to="/Home">Home</router-link></li>
        <!-- <li><router-link to="/services">Services</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li> -->
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navigation',
  };
  </script>
  
  <style scoped>
  nav {
    top: 0;
    left: 0;
    margin-left: 2em;
    margin-top: 2em;
    margin-right: 2em;
    position: fixed;
    background-color: #77c6fc;
    border-radius: 10px;
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);
    transition: ease 0.3s;
  }

  @media screen and (max-width: 1000px) {
      nav {
        top: 0;
        right: 0;
        left: auto;
      }
  }
  
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  li {
    float: left;
  }
  
  li a {
    display: block;
    color: black;
    font-size: larger;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }
  
  nav:hover {
    background-color: white;
  }
  </style>