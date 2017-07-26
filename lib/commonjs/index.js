"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function switchPathInputGuard(path, routes) {
    if (!util_1.isPattern(path)) {
        throw new Error("First parameter to switchPath must be a route path.");
    }
    if (!util_1.isRouteDefinition(routes)) {
        throw new Error("Second parameter to switchPath must be an object " +
            "containing route patterns.");
    }
}
function validatePath(sourcePath, matchedPath) {
    var sourceParts = util_1.splitPath(sourcePath);
    var matchedParts = util_1.splitPath(matchedPath);
    for (var i = 0; i < matchedParts.length; ++i) {
        if (matchedParts[i] !== sourceParts[i]) {
            return null;
        }
    }
    return "/" + util_1.extractPartial(sourcePath, matchedPath);
}
function betterMatch(candidate, reference) {
    if (!util_1.isNotNull(candidate)) {
        return false;
    }
    if (!util_1.isNotNull(reference)) {
        return true;
    }
    if (!validatePath(candidate, reference)) {
        return false;
    }
    return candidate.length >= reference.length;
}
function matchesWithParams(sourcePath, pattern) {
    var sourceParts = util_1.splitPath(sourcePath);
    var patternParts = util_1.splitPath(pattern);
    var params = patternParts
        .map(function (part, i) { return util_1.isParam(part) ? sourceParts[i] : null; })
        .filter(util_1.isNotNull);
    var matched = patternParts
        .every(function (part, i) { return util_1.isParam(part) || part === sourceParts[i]; });
    return matched ? params : [];
}
function getParamFnValue(paramFn, params) {
    var _paramFn = util_1.isRouteDefinition(paramFn) ? paramFn["/"] : paramFn;
    return typeof _paramFn === "function" ? _paramFn.apply(void 0, params) : _paramFn;
}
function validate(_a) {
    var sourcePath = _a.sourcePath, matchedPath = _a.matchedPath, matchedValue = _a.matchedValue, routes = _a.routes;
    var path = matchedPath ? validatePath(sourcePath, matchedPath) : null;
    var value = matchedValue;
    if (!path) {
        if (sourcePath === "/") {
            path = routes["*"] ? sourcePath : null;
            value = path ? routes["/$"] : null;
        }
        else {
            path = routes["*"] ? sourcePath : null;
            value = path ? routes["*"] : null;
        }
    }
    return { path: path, value: value };
}
function switchPath(sourcePath, routes) {
    switchPathInputGuard(sourcePath, routes);
    var matchedPath = null;
    var matchedValue = null;
    util_1.traverseRoutes(routes, function matchPattern(pattern) {
        if (pattern[pattern.length - 1] === "$") {
            var realPattern = pattern.split("/$").join("");
            if (sourcePath.search(realPattern) === 0 &&
                betterMatch(pattern, matchedPath) ||
                sourcePath.search(realPattern + "/") &&
                    betterMatch(pattern, matchedPath)) {
                matchedPath = realPattern;
                matchedValue = routes[pattern];
            }
            return;
        }
        if (sourcePath.search(pattern) === 0 && betterMatch(pattern, matchedPath)) {
            matchedPath = pattern;
            matchedValue = routes[pattern];
        }
        var params = matchesWithParams(sourcePath, pattern).filter(Boolean);
        if (params.length > 0 && betterMatch(sourcePath, matchedPath)) {
            matchedPath = util_1.extractPartial(sourcePath, pattern);
            matchedValue = getParamFnValue(routes[pattern], params);
        }
        if (util_1.isRouteDefinition(routes[pattern]) && params.length === 0) {
            if (sourcePath !== "/") {
                var child = switchPath(util_1.unprefixed(sourcePath, pattern) || "/", routes[pattern]);
                var nestedPath = pattern + child.path;
                if (child.path !== null &&
                    betterMatch(nestedPath, matchedPath)) {
                    matchedPath = nestedPath;
                    matchedValue = child.value;
                }
            }
        }
    });
    return validate({ sourcePath: sourcePath, matchedPath: matchedPath, matchedValue: matchedValue, routes: routes });
}
exports.default = switchPath;
//# sourceMappingURL=index.js.map