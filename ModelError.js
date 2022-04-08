
export default class ModelError extends Error {
  
    // Construtor da Classe ModelError
    constructor(txtDeErro, erro) {
      super(txtDeErro + ":" + erro); // Chamando o construtor da superclasse (Error)
      console.log(txtDeErro + ":" + erro + '\n\n' + this.stack);
    }
}