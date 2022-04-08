"use strict";

import CtrlManterAlunos from "/CtrlManterAlunos.js";

export default class CtrlSessao {
  
  //-----------------------------------------------------------------------------------------//
  
  constructor() {
    this.ctrlAtual = new CtrlManterAlunos();
  }
  
  //-----------------------------------------------------------------------------------------//
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
  .then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

var sessao = new CtrlSessao();

//------------------------------------------------------------------------//
