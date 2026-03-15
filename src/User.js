export default class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || 'Invitado';
        this.email = data.email || '';
        this.role = data.role || { name: 'guest' };
        this.token = data.token || localStorage.getItem('user_token');
    }

    get isAdmin() {
        return this.role && this.role.id === 1;
    }

    login(token, userData) {
        this.token = token;
        this.id = userData.id;
        this.name = userData.name;
        this.email = userData.email;
        this.role = userData.role;
        localStorage.setItem('user_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    logout() {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    update(newData) {
        Object.assign(this, newData);
    }
}