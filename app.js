// Wait for the DOM to be ready and page loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check on pageload if anyone is logged in
    const userCheck = userLoggedIn();

    // Get the username text input field
    const usernameField = document.getElementById('username');

    // Get login button
    const loginButton = document.getElementById('login');

    // Button for logging a user out
    const logoutButton = document.getElementById('logout');

    // Status DIV
    const status = document.getElementById('status');

    // Is the user already logged in?
    if (userCheck) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'initial';
        status.innerHTML = `${userCheck.username} is logged in.`;
    } else {
        loginButton.style.display = 'initial';
        logoutButton.style.display = 'none';
        status.innerHTML = 'You are not logged in';
    }

    // When login button is clicked
    loginButton.addEventListener('click', (e) => {
        // Stop the default action from doing anything
        e.preventDefault();

        // Check window.steem_keychain exists
        if (steem_keychain) {
            // Get the value from the username field
            const username = usernameField.value;

            // Call request sign buffer method with username, random memo and Posting key
            steem_keychain.requestSignBuffer(username, `dice_login-${Math.floor(100000000 + Math.random() * 900000000)}`, 'Posting', response => {
                if (response.success === true) {                    
                    // If user is already logged in
                    if (userLoggedIn()) {
                      return;
                    }
    
                    const user = {
                       username: response.data.username,
                       type: 'keychain'
                    }
    
                    setUser(user);
                } else {
                  //  Verification failed
                }
            });

        }
    });

    // When the logout button is clicked
    logoutButton.addEventListener('click', (e) => {
        // Stop the default action from doing anything
        e.preventDefault();

        logoutUser();

        logoutButton.style.display = 'none';
        loginButton.style.display = 'initial';
    });

});

function userLoggedIn() {
    const value = localStorage.getItem('__keychainAuth');

    return value ? JSON.parse(value) : false;
}

function setUser(token) {
    localStorage.setItem('__keychainAuth', JSON.stringify(token));
}

function logoutUser() {
    localStorage.removeItem('__keychainAuth');
}