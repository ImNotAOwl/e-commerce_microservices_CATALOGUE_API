export interface IApiResponse {
  /**
   * Code de statut HTTP de la réponse.
   */
  status: number;

  /**
   * Message de la réponse.
   */
  message: string;

  /**
   * Permet d'ajouter dynamiquement d'autres propriétés.
   */
  [key: string]: unknown;

  /**
   * Définit le message de la réponse.
   * @param message - Message à associer à la réponse.
   * @returns L'instance de l'objet de réponse pour le chaînage.
   */
  setMessage(message: string): this;

  /**
   * Définit le code de statut de la réponse.
   * @param status - Code de statut HTTP.
   * @returns L'instance de l'objet de réponse pour le chaînage.
   */
  setStatus(status: number): this;

  /**
   * Ajoute dynamiquement des données à la réponse.
   * @param data - Données à ajouter, sous forme d'objet.
   * @returns L'instance de l'objet de réponse pour le chaînage.
   */
  addData(data: object): this;

  /**
   * Construit une réponse de succès avec un message, des données supplémentaires et un code de statut.
   * @param message - Message de succès.
   * @param data - Données supplémentaires.
   * @param status - Code de statut HTTP, par défaut 200.
   * @returns L'instance de l'objet de réponse pour le chaînage.
   */
  buildSuccess(message: string, data: object, status?: number): this;

  /**
   * Construit une réponse d'erreur avec un message et un code de statut.
   * @param message - Message d'erreur.
   * @param status - Code de statut HTTP, par défaut 400.
   * @returns L'instance de l'objet de réponse pour le chaînage.
   */
  buildError(message: string, status?: number): this;
}
