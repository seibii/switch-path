"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPattern(candidate) {
    return candidate.charAt(0) === "/" || candidate === "*";
}
exports.isPattern = isPattern;
function isRouteDefinition(candidate) {
    return !candidate || typeof candidate !== "object" ?
        false : isPattern(Object.keys(candidate)[0]);
}
exports.isRouteDefinition = isRouteDefinition;
function traverseRoutes(routes, callback) {
    var keys = Object.keys(routes);
    for (var i = 0; i < keys.length; ++i) {
        var pattern = keys[i];
        if (pattern === "*")
            continue;
        callback(pattern);
    }
}
exports.traverseRoutes = traverseRoutes;
function isNotNull(candidate) {
    return candidate !== null;
}
exports.isNotNull = isNotNull;
function splitPath(path) {
    return path.split("/").filter(function (s) { return !!s; });
}
exports.splitPath = splitPath;
function isParam(candidate) {
    return candidate.match(/:\w+/) !== null;
}
exports.isParam = isParam;
function extractPartial(sourcePath, pattern) {
    var patternParts = splitPath(pattern);
    var sourceParts = splitPath(sourcePath);
    var matchedParts = [];
    for (var i = 0; i < patternParts.length; ++i) {
        matchedParts.push(sourceParts[i]);
    }
    return matchedParts.filter(isNotNull).join("/");
}
exports.extractPartial = extractPartial;
function unprefixed(fullString, prefix) {
    return fullString.split(prefix)[1];
}
exports.unprefixed = unprefixed;
//# sourceMappingURL=util.js.map