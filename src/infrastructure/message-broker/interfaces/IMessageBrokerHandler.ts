export interface IMessageBrokerHandler {
  /**
   * Connecte au serveur RabbitMQ et initialise la file d'attente.
   * @param exchange - Le nom de l'échange à laquelle se connecter.
   * @returns Une promesse qui se résout lorsque la connexion et la file sont prêtes.
   */
  connect(exchange: string): Promise<void>;

  /**
   * Envoie un message dans la file d'attente spécifiée lors de la connexion.
   * @param message - Le message à envoyer, sous forme de chaîne de caractères.
   * @returns Une promesse qui se résout lorsque le message est envoyé.
   */
  sendMessage(message: string, routingKey: string): Promise<void>;

  /**
   * Démarre l'écoute des messages dans la file d'attente et exécute
   * la fonction `onMessage` pour chaque message reçu.
   * @param onMessage - Fonction de rappel exécutée pour chaque message reçu, prenant le message sous forme de chaîne de caractères.
   * @returns Une promesse qui se résout lorsque l'écoute démarre avec succès.
   */
  startListening(onMessage: (msg: string) => void): Promise<void>;

  /**
   * Ferme la connexion RabbitMQ et le canal.
   * @returns Une promesse qui se résout lorsque la connexion et le canal sont fermés.
   */
  close(): Promise<void>;
}
