import { isPattern, isRouteDefinition, traverseRoutes, isNotNull, splitPath, isParam, extractPartial, unprefixed, } from './util';
function switchPathInputGuard(path, routes) {
    if (!isPattern(path)) {
        throw new Error("First parameter to switchPath must be a route path.");
    }
    if (!isRouteDefinition(routes)) {
        throw new Error("Second parameter to switchPath must be an object " +
            "containing route patterns.");
    }
}
function validatePath(sourcePath, matchedPath) {
    var sourceParts = splitPath(sourcePath);
    var matchedParts = splitPath(matchedPath);
    for (var i = 0; i < matchedParts.length; ++i) {
        if (matchedParts[i] !== sourceParts[i]) {
            return null;
        }
    }
    return "/" + extractPartial(sourcePath, matchedPath);
}
function betterMatch(candidate, reference) {
    if (!isNotNull(candidate)) {
        return false;
    }
    if (!isNotNull(reference)) {
        return true;
    }
    if (!validatePath(candidate, reference)) {
        return false;
    }
    return candidate.length >= reference.length;
}
function matchesWithParams(sourcePath, pattern) {
    var sourceParts = splitPath(sourcePath);
    var patternParts = splitPath(pattern);
    var params = patternParts
        .map(function (part, i) { return isParam(part) ? sourceParts[i] : null; })
        .filter(isNotNull);
    var matched = patternParts
        .every(function (part, i) { return isParam(part) || part === sourceParts[i]; });
    return matched ? params : [];
}
function getParamFnValue(paramFn, params) {
    var _paramFn = isRouteDefinition(paramFn) ? paramFn["/"] : paramFn;
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
export default function switchPath(sourcePath, routes) {
    switchPathInputGuard(sourcePath, routes);
    var matchedPath = null;
    var matchedValue = null;
    traverseRoutes(routes, function matchPattern(pattern) {
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
            matchedPath = extractPartial(sourcePath, pattern);
            matchedValue = getParamFnValue(routes[pattern], params);
        }
        if (isRouteDefinition(routes[pattern]) && params.length === 0) {
            if (sourcePath !== "/") {
                var child = switchPath(unprefixed(sourcePath, pattern) || "/", routes[pattern]);
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
//# sourceMappingURL=index.js.map