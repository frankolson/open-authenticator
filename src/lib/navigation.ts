import { Params } from "src/hooks/useLocation";

export function matchPath(path: string, currentPath: string): Params | false {
  const pathSegments = splitPathSegments(path)
  const currentPathSegments = splitPathSegments(currentPath);
  const matchers = [exactSegmentMatcher, paramSegmentMatcher];
  const params = matchSegments(pathSegments, currentPathSegments, matchers);

  return params !== false ? params : false;
}

function splitPathSegments(path: string) {
  return path.split('/').filter(Boolean);
}

function exactSegmentMatcher(segment: string, currentSegment: string) {
  return segment === currentSegment;
}

function paramSegmentMatcher(segment: string, currentSegment: string) {
  if (segment.startsWith(':')) {
    const key = segment.slice(1);
    return { [key]: currentSegment };
  }
}

function matchSegments(pathSegments: string[], currentPathSegments: string[], matchers: Function[]): Params | false {
  if (pathSegments.length !== currentPathSegments.length) {
    return false;
  }

  return pathSegments.reduce((acc, segment, index) => {
    if (acc === false) return false;

    const currentSegment = currentPathSegments[index];
    const result = applyMatchers(segment, currentSegment, matchers);

    return result ? { ...acc, ...result } : false;
  }, {});
}

function applyMatchers(segment: string, currentSegment: string, matchers: Function[]) {
  for (const matcher of matchers) {
    const result = matcher(segment, currentSegment);
    if (result) {
      return result;
    }
  }
}