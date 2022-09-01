///<reference path="sipauth.ts" />
// UI Constants
var form_main = "mainForm";
var input_method = "sipMethod";
var input_authHeader = "authHeader";
var input_username = "sipUsername";
var input_realm = "sipRealm";
var input_password = "sipPassword";
var div_resultWrapper = "resultsDiv";
var div_resultHeader = "resultsHeader";
var div_resultBody = "resultsBody";
var style_visible = "visible";
var style_card_success = "card border-success fw-bold text-success";
var style_card_danger = "card border-danger fw-bold text-danger";
function init() {
    document.getElementById(form_main).onsubmit = execute;
}
function execute() {
    var methodElement = document.getElementById(input_method);
    var method = methodElement.options[methodElement.selectedIndex].textContent;
    var authHeader = document.getElementById(input_authHeader).value;
    var username = document.getElementById(input_username).value;
    var realm = document.getElementById(input_realm).value;
    var password = document.getElementById(input_password).value;
    var result = new SIPAuthTestResult(method, authHeader, username, realm, password);
    return buildOutput(result);
}
function buildOutput(result) {
    var resultsDiv = document.getElementById(div_resultWrapper);
    var resultsHeader = document.getElementById(div_resultHeader);
    resultsDiv.style.visibility = style_visible;
    resultsHeader.innerHTML = "";
    if (result.providedHash == result.calculatedHash) {
        resultsDiv.className = style_card_success;
        resultsHeader.appendChild(document.createTextNode("Verification Successful"));
    }
    else {
        resultsDiv.className = style_card_danger;
        resultsHeader.appendChild(document.createTextNode("Verification Failed"));
    }
    var resultsBody = document.getElementById(div_resultBody);
    resultsBody.innerHTML = "";
    appendTextLine(resultsBody, "Method: " + result.method, false);
    var usernameResult = "Username: " + result.extractedUsername;
    var usernameBold = false;
    if (result.providedUsername != null && result.providedUsername != result.extractedUsername) {
        usernameResult = usernameResult + " <--- Mismatch!";
        usernameBold = true;
    }
    appendTextLine(resultsBody, usernameResult, usernameBold);
    var realmResult = "Realm: " + result.extractedRealm;
    var realmBold = false;
    if (result.providedRealm != null && result.providedRealm != result.extractedRealm) {
        realmResult = realmResult + " <--- Mismatch!";
        realmBold = true;
    }
    appendTextLine(resultsBody, realmResult, realmBold);
    appendTextLine(resultsBody, "URI: " + result.uri, false);
    appendTextLine(resultsBody, "Nonce: " + result.nonce, false);
    appendTextLine(resultsBody, "CNonce: " + result.cnonce, false);
    appendTextLine(resultsBody, "QOP: " + result.qop, false);
    appendTextLine(resultsBody, "NC: " + result.nc, false);
    appendTextLine(resultsBody, "Provided Response: " + result.providedHash, false);
    appendTextLine(resultsBody, "Calculated Response: " + result.calculatedHash, result.providedHash != result.calculatedHash);
    return false;
}
function appendTextLine(resultsBody, value, bold) {
    if (bold) {
        var boldElement = document.createElement("b");
        boldElement.innerHTML = value;
        resultsBody.appendChild(boldElement);
    }
    else {
        resultsBody.appendChild(document.createTextNode(value));
    }
    resultsBody.appendChild(document.createElement("br"));
}
window.onload = init;
