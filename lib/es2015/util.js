export function isPattern(candidate) {
    return candidate.charAt(0) === "/" || candidate === "*";
}
export function isRouteDefinition(candidate) {
    return !candidate || typeof candidate !== "object" ?
        false : isPattern(Object.keys(candidate)[0]);
}
export function traverseRoutes(routes, callback) {
    var keys = Object.keys(routes);
    for (var i = 0; i < keys.length; ++i) {
        var pattern = keys[i];
        if (pattern === "*")
            continue;
        callback(pattern);
    }
}
export function isNotNull(candidate) {
    return candidate !== null;
}
export function splitPath(path) {
    return path.split("/").filter(function (s) { return !!s; });
}
export function isParam(candidate) {
    return candidate.match(/:\w+/) !== null;
}
export function extractPartial(sourcePath, pattern) {
    var patternParts = splitPath(pattern);
    var sourceParts = splitPath(sourcePath);
    var matchedParts = [];
    for (var i = 0; i < patternParts.length; ++i) {
        matchedParts.push(sourceParts[i]);
    }
    return matchedParts.filter(isNotNull).join("/");
}
export function unprefixed(fullString, prefix) {
    return fullString.split(prefix)[1];
}
//# sourceMappingURL=util.js.map