/* Javascript of sign up page */

/* Selectors */
const buttonForm = document.querySelector('#buttonForm');
const usernameBox = document.querySelector('#usernameInput');
const emailBox = document.querySelector('#emailInput');
const passwordBox = document.querySelector('#passwordInput');
const passwordConfirmBox = document.querySelector('#passwordInputConfirm');

const messageLabel = document.querySelector('#message');

buttonForm.addEventListener('submit', signUpAction);

/*** Functions that don't edit DOM.
 ***/

// Event that happens when sign up button be clicked
function signUpAction(e) {
    e.preventDefault();

    const username = usernameBox.value;
    const email = emailBox.value;
    const password = passwordBox.value;
    const passwordConfirm = passwordConfirmBox.value;

    // console.log("sign up");

    if (!checkValidPassword(password, passwordConfirm)) {
        showMessage("Passwords do not match");
    } else if (password.length < 6) {
        showMessage("Password too short")
    } else {
        const url = '/user/sign_up';
        const request = new Request(url, {
            method: 'post',
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password,
                "password_confirm": passwordConfirm,
                "is_admin": false
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                // console.log(res.body);
                // document.cookie = "username="
                // loginSucceed()
                signUpSucceed(username, password)
            } else {
                // console.log(res.status);
                showMessage(res.statusText)
            }
        }).catch((error) => {
            console.log(error)
        });
    }

}

// Return true iff the password is valid.
function checkValidPassword(password1, password2) {
    return password1 === password2;
}

// Function to be executed after successfully signed up
function signUpSucceed(username, password) {
    const url = '/user/login';
    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify({"username": username, "password": password}),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request).then(function(res) {
        if (res.status === 200) {
            window.location.href = "../index/index_logged_in.html"
        } else {
            console.log(res);
        }
    }).catch((error) => {
        console.log(error)
    });
}

/*** DOM functions ***/

// Show message to the page
function showMessage(text) {
    messageLabel.innerHTML = "";
    const textNode = document.createTextNode(text);
    messageLabel.appendChild(textNode);
}
