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
    this.birthday = null;
    Object.assign(this, data);
  }
}
export default User;
