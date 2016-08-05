///<reference path="sipauth.ts" />

// UI Constants
const form_main: string = "mainForm";
const input_method: string = "sipMethod";
const input_authHeader: string = "authHeader";
const input_password: string = "sipPassword";
const div_resultWrapper: string = "resultsDiv";
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
    var password: string = (<HTMLInputElement>document.getElementById(input_password)).value;
    let result: SIPAuthTestResult = new SIPAuthTestResult(method, authHeader, password);
    return buildOutput(result);
}

function buildOutput(result: SIPAuthTestResult): boolean {
    let resultsDiv: HTMLElement = document.getElementById(div_resultWrapper);
    resultsDiv.style.visibility = style_visible;

    if (result.providedHash == result.calculatedHash) {
        resultsDiv.className = style_panel_success;
    }
    else {
        resultsDiv.className = style_panel_danger;
    }

    var resultsBody: HTMLElement = document.getElementById(div_resultBody);
    resultsBody.innerHTML = "";
    resultsBody.appendChild(document.createTextNode(`Method: ${result.method}`));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode(`Username: ${result.username}`));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode(`Realm: ${result.realm}`));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode(`URI: ${result.uri}`));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode(`Nonce: ${result.nonce}`));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode(`CNonce: ${result.cnonce}`));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode(`QOP: ${result.qop}`));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode(`NC: ${result.nc}`));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode(`Provided Response: ${result.providedHash}`));
    resultsBody.appendChild(document.createElement("br"));
    resultsBody.appendChild(document.createTextNode(`Calculated Response: ${result.calculatedHash}`));
    resultsBody.appendChild(document.createElement("br"));
    return false;
}

window.onload = init;
