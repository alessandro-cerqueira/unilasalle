"use strict";

import ModelError from "/ModelError.js";
import Departamento from "/Departamento.js";

export default class DaoDepartamento {

    //-----------------------------------------------------------------------------------------//

    static conexao = null;

    constructor() {
        this.arrayDepartamentos = [];
        this.obterConexao();
    }

    /*
    *  Devolve uma Promise com a referência para o BD
    */ 
    async obterConexao() {
        if(DaoDepartamento.conexao == null) {
            DaoDepartamento.conexao = new Promise(function(resolve, reject) {
            let requestDB = window.indexedDB.open("DepartamentoDB", 1); 

            requestDB.onupgradeneeded = (event) => {
            let db = event.target.result;
            let store = db.createObjectStore("DepartamentoST", {
                autoIncrement: true
            });
            store.createIndex("idxSigla", "sigla", { unique: true });
            };

            requestDB.onerror = event => {
            reject(new ModelError("Erro: " + event.target.errorCode));
            };

            requestDB.onsuccess = event => {
            if (event.target.result) {
                // event.target.result apontará para IDBDatabase aberto
                resolve(event.target.result);
            }
            else 
                reject(new ModelError("Erro: " + event.target.errorCode));
            };
        });
        }
        return await DaoDepartamento.conexao;
    }

    //-----------------------------------------------------------------------------------------//

    async obterDepartamentos() {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["DepartamentoST"], "readonly");
                store = transacao.objectStore("DepartamentoST");
                indice = store.index('idxSigla');
            } 
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }
            let array = [];
            indice.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {        
                const novo = Departamento.assign(cursor.value);
                array.push(novo);
                cursor.continue();
                } else {
                resolve(array);
                }
            };
        });
        this.arrayDepartamentos = await promessa;
        return this.arrayDepartamentos;
    }

    //-----------------------------------------------------------------------------------------//

    async obterDepartamentoPelaSigla(sigla) {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["DepartamentoST"], "readonly");
                store = transacao.objectStore("DepartamentoST");
                indice = store.index('idxSigla');
            } 
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }

            let consulta = indice.get(sigla);
            consulta.onsuccess = function(event) { 
                if(consulta.result != null)
                resolve(Departamento.assign(consulta.result)); 
                else
                resolve(null);
            };
            consulta.onerror = function(event) { reject(null); };
        });
        let departamento = await promessa;
        return departamento;
    }

    //-----------------------------------------------------------------------------------------//

    async obterDepartamentosPeloAutoIncrement() {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
        let transacao;
        let store;
        try {
            transacao = connection.transaction(["DepartamentoST"], "readonly");
            store = transacao.objectStore("DepartamentoST");
        } 
        catch (e) {
            reject(new ModelError("Erro: " + e));
        }
        let array = [];
        store.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {        
            const novo = Departamento.assign(cursor.value);
            array.push(novo);
            cursor.continue();
            } else {
            resolve(array);
            }
        };
        });
        this.arrayDepartamentos = await promessa;
        return this.arrayDepartamentos;
    }

     //-----------------------------------------------------------------------------------------//

  async incluir(departamento) {
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["DepartamentoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o departamento", event.target.error));
      };
      let store = transacao.objectStore("DepartamentoST");
      let requisicao = store.add(Departamento.deassign(departamento));
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(departamento) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["DepartamentoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o departamento", event.target.error));
      };
      let store = transacao.objectStore("DepartamentoST");     
      let indice = store.index('idxSigla');
      var keyValue = IDBKeyRange.only(departamento.getSigla());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.sigla == departamento.getSigla()) {
            const request = cursor.update(Departamento.deassign(departamento));
            request.onsuccess = () => {
              console.log("[DaoDepartamento.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Departamento com a sigla " + departamento.getSigla() + " não encontrado!",""));
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(departamento) {
    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["DepartamentoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o departamento", event.target.error));
      };
      let store = transacao.objectStore("DepartamentoST");
      let indice = store.index('idxSigla');
      var keyValue = IDBKeyRange.only(departamento.getSigla());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.sigla == departamento.getSigla()) {
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Departamento com a sigla " + departamento.getSigla() + " não encontrado!",""));
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}
