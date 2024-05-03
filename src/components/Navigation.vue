<!-- Navigation.vue -->
<template>
    <nav>
      <ul>
        <li><router-link to="/Home">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
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
    background-color: #333;
    color: #fff;
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
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }
  
  li a:hover {
    background-color: #111;
  }
  </style>