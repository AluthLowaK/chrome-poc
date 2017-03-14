/**
 * Created by nayana on 3/3/17.
 */



//onLoad='set_1024f4();'
//onClick='rng_seed_time();' onKeyPress='rng_seed_time();'

var debug = true;

var debugPrint = function (str) {
    if (debug) return console.log(str);
};

var logoutHandler = function () {

    chrome.storage.sync.set({"reg": {status: 0}, result: { }}, function () {
        if (chrome.runtime.error) {
            debugPrint(chrome.runtime.error);
            throw Exception("chrome exception");
        }
    });

    displayLoginForm();
};

var loginHandler = function () {

    var user = document.getElementById('loginEmail').value;
    var pass = document.getElementById('loginPass').value;
    var cid = chrome.runtime.id;
    login(cid, user, pass, function (err, result) {
        if (err !== null) {
            debugPrint(result);
            return false;
        }

        chrome.storage.sync.get("reg", function (reg) {
            var walletResult = reg.reg.result;
            chrome.storage.sync.set({"reg": {status: 1, result: walletResult}}, function () {
                if (chrome.runtime.error) {
                    debugPrint(chrome.runtime.error);
                    throw Exception("chrome exception");
                }
                displayDashboardForm(cid, user);
            });
        });
    });
};

var registerHandler = function () {
    var user = document.getElementById('registerEmail').value;
    var pass = document.getElementById('registerPass').value;
    var cid = chrome.runtime.id;

    register(cid, user, pass, function (err, res) {
        if (err !== null) {
            throw new Exception("Problem creating account");
        }
        chrome.storage.sync.set({"reg" : {"status": res.status, "result": res.result}}, function () {
            if (chrome.runtime.error) {
                debugPrint(chrome.runtime.error);
                throw Exception("chrome exception");
            }

            displayLoginForm();

        });
    });
};

var createWalletHandler = function () {
    var cid = chrome.runtime.id;
    createWallet(cid, function (err, res) {
        if (err !== null || res.status !== 0) return false;

        res.wallet = res.wallet || null;

        chrome.storage.sync.set({"reg": {status: 2, result: { cid: cid, wallet: res.wallet }}}, function () {
            if (chrome.runtime.error) {
                debugPrint(chrome.runtime.error);
                throw Exception("chrome exception");
            }
            displayDashboardForm(cid, user);
        });

    });
};

document.body.onload = function() {

    var regComplete = -1; var extraData = null;

    var regForm = document.getElementById("register-form");
    var loginForm = document.getElementById("login-form");

    var onLogout = document.getElementById("logout-btn").addEventListener("click", logoutHandler);
    var onLogin = document.getElementById("login-btn").addEventListener("click", loginHandler);
    var onRegister = document.getElementById("register-btn").addEventListener("click", registerHandler);
    var onCreateWallet = document.getElementById("create-wallet-btn").addEventListener("click", createWalletHandler);


    chrome.storage.sync.get("reg", function (reg) {

        if (!chrome.runtime.error && reg.reg.status !== undefined) {
            regComplete = reg.reg.status;
            extraData = reg.reg.result || { cid: "foo", user: "bar"};
            console.log(extraData);
        }

        switch (regComplete) {
            case 0:
                displayLoginForm();
                break;
            case 1:
            case 2:
                displayDashboardForm(extraData.cid, extraData.user, false);
                break;
            default:
                displayRegisterForm();
                break;
        }
    });
};


var displayLoginForm = function () {
    var regForm = document.getElementById("register-form");
    regForm.style.display = "none";
    var loginForm = document.getElementById("login-form");
    loginForm.style.display = "block";
    document.getElementById("dashboard-form").style.display = "none";
};

var displayRegisterForm = function () {
    var regForm = document.getElementById("register-form");
    regForm.style.display = "block";
    var loginForm = document.getElementById("login-form");
    loginForm.style.display = "none";
    document.getElementById("dashboard-form").style.display = "none";
};

var displayDashboardForm = function (cid, user, canCreateWallet) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "none";
    document.getElementById("dashboard-form").style.display = "block";

    document.getElementById("span-cid").innerText = cid;
    document.getElementById("span-user").innerText = user;

    if (!canCreateWallet) {
        document.getElementById('create-wallet-btn').style.display = 'none';
    }

    chrome.storage.sync.get("reg", function (reg) {
        var addr = reg.reg.result.wallet.addr;
        document.getElementById("span-user").innerHTML = '<a href="https://blockchain.info/address/' + addr + '">' + addr + '</a>';
    });
};

//takes user and pass, and post json into register function, adds chrome-runtime-id internally,
//TODO refactor move runtime id outside of the function
function register(cid, user, pass, cb) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify({cid: cid, user: user, pass: pass});
    xhr.open("POST", "https://mockup.oro.world:3000/register", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            debugPrint(xhr.responseText);
            var resp = JSON.parse(xhr.responseText);
            cb(null, resp);
        }
    };
    xhr.send(data);
}

function login(cid, user, pass, cb) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify({cid: cid, user: user, pass: pass});
    xhr.open("POST", "https://mockup.oro.world:3000/login", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            debugPrint(xhr.responseText);
            var resp = JSON.parse(xhr.responseText);
            return cb(null, resp);
        }
    };
    xhr.send(data);
}


function createWallet(cid, cb) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify({cid: cid});
    xhr.open("POST", "https://mockup.oro.world:3000/wallet", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {

            var resp = JSON.parse(xhr.responseText);
            debugPrint("======= wallet function=============\n");
            debugPrint(resp);
            return cb(null, resp);
        }
    };
    xhr.send(data);
}