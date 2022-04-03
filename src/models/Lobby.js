/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.id = null;
    this.hostId = null;
    this.name = null;
    this.isPublic = null;
    this.listOfUserId = null;
    Object.assign(this, data);
  }
}
export default Lobby;
