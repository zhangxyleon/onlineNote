/* Javascript of login page */

const tempUsers = [];  // Array of hard-code users

// User "class"
class User {
    constructor(username, email, password, group) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.group = group;
        this.icon = 'userPic.jpg';
    }
}

tempUsers.push(new User("user", "user@email.com", "password", "u"));  // Hard-code user

/* Selectors */
const buttonForm = document.querySelector('#buttonForm');
const usernameBox = document.querySelector('#usernameInput');
const passwordBox = document.querySelector('#passwordInput');

const messageLabel = document.querySelector('#message');

buttonForm.addEventListener('submit', loginAction);

/*** Functions that don't edit DOM.
 ***/

// Check whether the input username and password are a valid combination.
function loginAction(e) {
    e.preventDefault();

    const username = usernameBox.value;
    const password = passwordBox.value;
    // console.log(username);

    const url = '/user/login';
    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify({"username": username, "password": password}),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request).then(function (res) {
        if (res.status === 200) {
            if (res.statusText === "true") {
                loginSucceedAdmin()
            } else {
                loginSucceed(username)
            }
        } else {
            // console.log(res);
            showMessage(res.statusText)
        }
    }).catch((error) => {
        console.log(error)
    });
}

// Login succeed
function loginSucceed(username) {
    console.log(username);
    document.cookie = "username=" + username;
    window.location.href = "../index/index_logged_in.html"
}

function loginSucceedAdmin() {
    window.location.href = "../admin_page/admin_page.html"
}

/*** DOM functions.
 ***/

// Show message to the page
function showMessage(text) {
    messageLabel.innerHTML = "";
    const textNode = document.createTextNode(text);
    messageLabel.appendChild(textNode);
}
