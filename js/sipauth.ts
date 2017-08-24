// RegEx Constants
const re_username: string = 'username=\"([^"]+)\"';
const re_realm: string = 'realm=\"([^"]+)\"';
const re_uri: string = 'uri=\"([^"]+)\"';
const re_nonce: string = '[^c]nonce=\"([^"]+)\"';
const re_cnonce: string = 'cnonce=\"([^"]+)\"';
const re_nc: string = 'nc=([0-9a-f]+)';
const re_qop: string = 'qop=\"?(auth|auth-int)\"?';
const re_response: string = 'response=\"([^"]+)\"';

declare function md5(value: string): string;

class SIPAuthTestResult {
    authHeader: string;
    password: string;
    providedUsername: string;
    extractedUsername: string;
    providedRealm: string;
    extractedRealm: string;
    method: string;
    uri: string;
    nonce: string;
    cnonce: string;
    nc: string;
    qop: string;
    providedHash: string;
    calculatedHash: string;

    constructor(method: string, authHeader: string, username: string, realm: string, password: string) {
        this.method = method;
        this.authHeader = authHeader;
        if (username != "") {
            this.providedUsername = username;
        }
        if (realm != "") {
            this.providedRealm = realm;
        }
        this.password = password;
        processHeader(this);
        return this;
    }
}

function processHeader(result: SIPAuthTestResult): void {
    result.extractedUsername = extractComponent(re_username, result.authHeader);
    result.extractedRealm = extractComponent(re_realm, result.authHeader);
    result.uri = extractComponent(re_uri, result.authHeader);
    result.qop = extractComponent(re_qop, result.authHeader);
    result.nonce = extractComponent(re_nonce, result.authHeader);
    result.cnonce = extractComponent(re_cnonce, result.authHeader);
    result.nc = extractComponent(re_nc, result.authHeader);
    result.providedHash = extractComponent(re_response, result.authHeader);

    let username = result.providedUsername != null ? result.providedUsername : result.extractedUsername;
    let realm = result.providedRealm != null ? result.providedRealm : result.extractedRealm;
    let ha1 = md5(`${username}:${realm}:${result.password}`);
    let ha2 = md5(`${result.method}:${result.uri}`);
    if (result.qop.toLowerCase() === "auth") {
        result.calculatedHash = md5(`${ha1}:${result.nonce}:${result.nc}:${result.cnonce}:${result.qop}:${ha2}`);
    } else {
        result.calculatedHash = md5(`${ha1}:${result.nonce}:${result.cnonce}`);
    }
}

function extractComponent(regex: string, source: string): string {
    let processor = new RegExp(regex, "i");
    let matchResult = processor.exec(source);
    if (matchResult != null && matchResult.length > 1) {
        return matchResult[1];
    }
    else {
        return "Not Found";
    }
}