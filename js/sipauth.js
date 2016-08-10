// RegEx Constants
var re_username = 'username=\"([^"]+)\"';
var re_realm = 'realm=\"([^"]+)\"';
var re_uri = 'uri=\"([^"]+)\"';
var re_nonce = '[^c]nonce=\"([^"]+)\"';
var re_cnonce = 'cnonce=\"([^"]+)\"';
var re_nc = 'nc=([0-9a-f]+)';
var re_qop = 'qop=\"?(auth|auth-int)\"?';
var re_response = 'response=\"([^"]+)\"';
var SIPAuthTestResult = (function () {
    function SIPAuthTestResult(method, authHeader, password) {
        this.method = method;
        this.authHeader = authHeader;
        this.password = password;
        processHeader(this);
        return this;
    }
    return SIPAuthTestResult;
}());
function processHeader(result) {
    result.username = extractComponent(re_username, result.authHeader);
    result.realm = extractComponent(re_realm, result.authHeader);
    result.uri = extractComponent(re_uri, result.authHeader);
    result.qop = extractComponent(re_qop, result.authHeader);
    result.nonce = extractComponent(re_nonce, result.authHeader);
    result.cnonce = extractComponent(re_cnonce, result.authHeader);
    result.nc = extractComponent(re_nc, result.authHeader);
    result.providedHash = extractComponent(re_response, result.authHeader);
    var ha1 = md5(result.username + ":" + result.realm + ":" + result.password);
    var ha2 = md5(result.method + ":" + result.uri);
    if (result.qop.toLowerCase() === "auth") {
        result.calculatedHash = md5(ha1 + ":" + result.nonce + ":" + result.nc + ":" + result.cnonce + ":" + result.qop + ":" + ha2);
    }
    else {
        result.calculatedHash = md5(ha1 + ":" + result.nonce + ":" + result.cnonce);
    }
}
function extractComponent(regex, source) {
    var processor = new RegExp(regex, "i");
    var matchResult = processor.exec(source);
    if (matchResult != null && matchResult.length > 1) {
        return matchResult[1];
    }
    else {
        return "Not Found";
    }
}
