///<reference path="sipauth.ts" />
// UI Constants
var form_main = "mainForm";
var input_method = "sipMethod";
var input_authHeader = "authHeader";
var input_password = "sipPassword";
var div_resultWrapper = "resultsDiv";
var div_resultHeader = "resultsHeader";
var div_resultBody = "resultsBody";
var style_visible = "visible";
var style_panel_success = "panel panel-success";
var style_panel_danger = "panel panel-danger";
function init() {
    document.getElementById(form_main).onsubmit = execute;
}
function execute() {
    var methodElement = document.getElementById(input_method);
    var method = methodElement.options[methodElement.selectedIndex].textContent;
    var authHeader = document.getElementById(input_authHeader).value;
    var password = document.getElementById(input_password).value;
    var result = new SIPAuthTestResult(method, authHeader, password);
    return buildOutput(result);
}
function buildOutput(result) {
    var resultsDiv = document.getElementById(div_resultWrapper);
    var resultsHeader = document.getElementById(div_resultHeader);
    resultsDiv.style.visibility = style_visible;
    resultsHeader.innerHTML = "";
    if (result.providedHash == result.calculatedHash) {
        resultsDiv.className = style_panel_success;
        resultsHeader.appendChild(document.createTextNode("Verification Successful"));
    }
    else {
        resultsDiv.className = style_panel_danger;
        resultsHeader.appendChild(document.createTextNode("Verification Failed"));
    }
    var resultsBody = document.getElementById(div_resultBody);
    resultsBody.innerHTML = "";
    resultsBody.appendChild(document.createTextNode("Method: " + result.method));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode("Username: " + result.username));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode("Realm: " + result.realm));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode("URI: " + result.uri));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode("Nonce: " + result.nonce));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode("CNonce: " + result.cnonce));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode("QOP: " + result.qop));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode("NC: " + result.nc));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode("Provided Response: " + result.providedHash));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode("Calculated Response: " + result.calculatedHash));
    resultsBody.appendChild(document.createElement("br"));
    return false;
}
window.onload = init;
