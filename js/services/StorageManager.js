/**
 * Gerencia a persistência de dados no localStorage.
 */
export class StorageManager {
  /**
   * Recupera um valor do localStorage.
   * @param {string} key - A chave do item a ser recuperado.
   * @returns {any | null} O item recuperado, ou nulo se não for encontrado.
   */
  static get(key) {
    const item = localStorage.getItem(key);
    return item ? item : null;
  }

  /**
   * Salva um valor no localStorage.
   * @param {string} key - A chave sob a qual salvar o item.
   * @param {any} value - O valor a ser salvo.
   */
  static set(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * Remove um valor do localStorage.
   * @param {string} key - A chave do item a ser removido.
   */
  static remove(key) {
    localStorage.removeItem(key);
  }
}