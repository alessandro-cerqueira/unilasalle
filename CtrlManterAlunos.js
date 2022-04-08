"use strict";

import Status from "/Status.js";
import Aluno from "/Aluno.js";
import DaoAluno from "/DaoAluno.js";
import ViewerAluno from "/ViewerAluno.js";

export default class CtrlManterAlunos {
  
  //-----------------------------------------------------------------------------------------//

  #dao;
  #viewer;
  #posAtual;
  #status;
  
  constructor() {
    this.#dao = new DaoAluno();
    this.#viewer = new ViewerAluno(this);
    this.#posAtual = 1;
    this.#contextoNavegacao();    
  }
  
  //-----------------------------------------------------------------------------------------//

  async #contextoNavegacao() {
    this.#status = Status.NAVEGANDO;
    this.#viewer.apresentando();
    let conjAlunos = await this.#dao.obterAlunos();
    if(conjAlunos.length == 0) {
      this.#posAtual = 0;
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      if(this.#posAtual == 0 || this.#posAtual > conjAlunos.length)
        this.#posAtual = 1;
      this.#viewer.apresentar(this.#posAtual, conjAlunos.length, conjAlunos[this.#posAtual - 1]);
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    this.#status = Status.NAVEGANDO;
    let conjAlunos = await this.#dao.obterAlunos();
    if(conjAlunos.length > 0)
      this.#posAtual = 1;
    this.#contextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    this.#status = Status.NAVEGANDO;
    let conjAlunos = await this.#dao.obterAlunos();
    if(this.#posAtual < conjAlunos.length)
      this.#posAtual++;
    this.#contextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    this.#status = Status.NAVEGANDO;
    let conjAlunos = await this.#dao.obterAlunos();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#contextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    this.#status = Status.NAVEGANDO;
    let conjAlunos = await this.#dao.obterAlunos();
    this.#posAtual = conjAlunos.length;
    this.#contextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#viewer.editando();
    this.#status = Status.INCLUINDO;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(matr, cpf, nome, email, telefone) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let aluno = new Aluno(matr, cpf, nome, email, telefone);
        await this.#dao.incluir(aluno); 
        this.#status = Status.NAVEGANDO;
        this.#contextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#contextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//

//var aluno1 = new Aluno('1234', '123.456.789-09', 'José da Silva Xavier','jose@eu.com.br','(21)98765-4321');
//aluno1.mostrar();

//var aluno2 = new Aluno('67890', '555.555.555-55', 'Maria de Souza','maria@eu.com.br','(21)99999-8888')//aluno2.mostrar();

//ctrl.dao.incluir(aluno1);
//ctrl.dao.incluir(aluno2);


//ctrl.dao.obterAlunos().then( async (value) => await alert(JSON.stringify(value)) ) ;

//aluno2.setNome('Maria de Souza RAMOS');
//ctrl.dao.alterar(aluno2);

//ctrl.dao.obterAlunos().then( async (value) => await alert(JSON.stringify(value)) ) ;

//ctrl.dao.excluir(aluno1);
//ctrl.dao.excluir(aluno2);

//alert("Atenção 3");
//ctrl.dao.obterAlunos().then( async (value) => await alert(JSON.stringify(value)) ) ;






























