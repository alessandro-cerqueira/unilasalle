import ModelError from "/ModelError.js";

export default class Departamento {
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #sigla;
  #nome;
  #numEmpregados;

  //-----------------------------------------------------------------------------------------//

  constructor(sigla, nome, numEmpregados) {
    this.setSigla(sigla);
    this.setNumEmpregados(numEmpregados);
    this.setNome(nome); 
  }
  
  //-----------------------------------------------------------------------------------------//

  getSigla() {
    return this.#sigla;
  }
  
  //-----------------------------------------------------------------------------------------//

  setSigla(sigla) {
    if(!Departamento.validarSigla(sigla))
      throw new ModelError("Sigla Inválida: " + sigla);
    this.#sigla = sigla;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNumEmpregados() {
    return this.#numEmpregados;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNumEmpregados(numEmpregados) {
    if(!Departamento.validarNumEmpregados(numEmpregados))
      throw new ModelError("Numero de Empregado Inválido: " + numEmpregados);
    this.#numEmpregados = numEmpregados;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNome() {
    return this.#nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNome(nome) {
    if(!Departamento.validarNome(nome))
      throw new ModelError("Nome Inválido: " + nome);
    this.#nome = nome;
  }

  //-----------------------------------------------------------------------------------------//

  toJSON() {
    return '{' +
               '"sigla" : "'+ this.#sigla + '",' +
               '"numEmpregados" :  "'     + this.#numEmpregados       + '",' +
               '"nome" : "'     + this.#nome      + '" ' + 
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Departamento(obj.sigla, obj.nome, obj.numEmpregados);
  }

  //-----------------------------------------------------------------------------------------//
  
  static deassign(obj) { 
    return JSON.parse(obj.toJSON());
  }

  //-----------------------------------------------------------------------------------------//

  static validarNome(nome) {
    if(nome == null || nome == "" || nome == undefined)
      return false;
    if (nome.length > 40) 
      return false;
    const padraoNome = /[A-Z][a-z] */;
    if (!padraoNome.test(nome)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarSigla(sigla) {
    if(sigla == null || sigla == "" || sigla == undefined)
      return false;
    if (sigla.length > 2) 
      return false;
    const padraoSigla = /[A-Z] */;
    if (!padraoSigla.test(sigla)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarNumEmpregados(numEmpregados) {
    if(numEmpregados == null || numEmpregados == "" || numEmpregados == undefined)
      return false;
    if(typeof numEmpregados !== 'number')
      return false;
    if(numEmpregados < 0)
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Sigla: " + this.sigla + "\n";
    texto += "Nome: " + this.nome + "\n";
    texto += "Número de empregado: " + this.numEmpregados + "\n";
      
    alert(texto);
  }
}