import { RouteDefinitions } from './types';
export declare function isPattern(candidate: string): boolean;
export declare function isRouteDefinition(candidate: any | undefined): boolean;
export declare function traverseRoutes(routes: RouteDefinitions, callback: (pattern: string) => any): void;
export declare function isNotNull(candidate: any): boolean;
export declare function splitPath(path: string): Array<string>;
export declare function isParam(candidate: string): boolean;
export declare function extractPartial(sourcePath: string, pattern: string): string;
export declare function unprefixed(fullString: string, prefix: string): string;
