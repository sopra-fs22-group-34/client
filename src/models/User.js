/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.password = null;
    this.token = null;
    this.logged_in = null;
    this.creation_date = null;
    this.lobby = null;
    this.score = null;
    this.games = null;
    this.is_public = null;
    Object.assign(this, data);
  }
}
export default User;
