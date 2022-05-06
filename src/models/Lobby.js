/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.host_id = null;
    this.host_name = null;
    this.current_players = null;
    this.total_players = null;
    this.is_open = null;
    this.is_public = null;
    this.players = null;
    this.timer = null;
    Object.assign(this, data);
  }
}
export default Lobby;
