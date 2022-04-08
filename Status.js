"use strict";

export default class Status {
  #nome;
  static NAVEGANDO = new Status('Navegando');
  static INCLUINDO = new Status('Incluindo');  
  
  constructor(nome) {
    this.#nome = nome;
  }  
}