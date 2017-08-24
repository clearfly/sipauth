///<reference path="sipauth.ts" />

// UI Constants
const form_main: string = "mainForm";
const input_method: string = "sipMethod";
const input_authHeader: string = "authHeader";
const input_username: string = "sipUsername";
const input_realm: string = "sipRealm";
const input_password: string = "sipPassword";
const div_resultWrapper: string = "resultsDiv";
const div_resultHeader: string = "resultsHeader";
const div_resultBody: string = "resultsBody";
const style_visible: string = "visible";
const style_panel_success: string = "panel panel-success";
const style_panel_danger: string = "panel panel-danger";

function init(): void {
    document.getElementById(form_main).onsubmit = execute;
}

function execute(): boolean {
    var methodElement = <HTMLSelectElement>document.getElementById(input_method);
    var method = methodElement.options[methodElement.selectedIndex].textContent;
    var authHeader: string = (<HTMLInputElement>document.getElementById(input_authHeader)).value;
    var username: string = (<HTMLInputElement>document.getElementById(input_username)).value;
    var realm: string = (<HTMLInputElement>document.getElementById(input_realm)).value;
    var password: string = (<HTMLInputElement>document.getElementById(input_password)).value;
    let result: SIPAuthTestResult = new SIPAuthTestResult(method, authHeader, username, realm, password);
    return buildOutput(result);
}

function buildOutput(result: SIPAuthTestResult): boolean {
    let resultsDiv: HTMLElement = document.getElementById(div_resultWrapper);
    let resultsHeader: HTMLElement = document.getElementById(div_resultHeader);
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

    let resultsBody: HTMLElement = document.getElementById(div_resultBody);
    resultsBody.innerHTML = "";
    appendTextLine(resultsBody, `Method: ${result.method}`, false);

    let usernameResult = `Username: ${result.extractedUsername}`;
    let usernameBold = false;
    if (result.providedUsername != null && result.providedUsername != result.extractedUsername) {
        usernameResult = `${usernameResult} <--- Mismatch!`;
        usernameBold = true;
    }
    appendTextLine(resultsBody, usernameResult, usernameBold);

    let realmResult = `Realm: ${result.extractedRealm}`;
    let realmBold = false;
    if (result.providedRealm != null && result.providedRealm != result.extractedRealm) {
        realmResult = `${realmResult} <--- Mismatch!`;
        realmBold = true;
    }
    appendTextLine(resultsBody, realmResult, realmBold);

    appendTextLine(resultsBody, `URI: ${result.uri}`, false);
    appendTextLine(resultsBody, `Nonce: ${result.nonce}`, false);
    appendTextLine(resultsBody, `CNonce: ${result.cnonce}`, false);
    appendTextLine(resultsBody, `QOP: ${result.qop}`, false);
    appendTextLine(resultsBody, `NC: ${result.nc}`, false);
    appendTextLine(resultsBody, `Provided Response: ${result.providedHash}`, false);
    appendTextLine(resultsBody, `Calculated Response: ${result.calculatedHash}`, result.providedHash != result.calculatedHash);
    return false;
}

function appendTextLine(resultsBody: HTMLElement, value: string, bold: boolean) {
    if (bold) {
        let boldElement = document.createElement("b");
        boldElement.innerHTML = value;
        resultsBody.appendChild(boldElement);
    }
    else {
        resultsBody.appendChild(document.createTextNode(value));
    }
    resultsBody.appendChild(document.createElement("br"));
}

window.onload = init;
