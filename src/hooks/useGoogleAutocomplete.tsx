import * as React from "react";
import uuid from "uuid/v4";
import "abortcontroller-polyfill";

const initialState = {
  results: {
    predictions: [],
    status: ""
  },
  isLoading: false,
  error: null
};

interface IGoogleProps {
  types?: "(cities)" | "geocode" | "establishments" | "address";
  language?: string;
  location?: "";
  radius?: number;
  strictbounds?: boolean;
  offset?: number;
}

export interface IAutocompleteProps {
  apiKey: string;
  query: string;
  type?: "places" | "query";
  debounceMs?: number;
  options?: IGoogleProps;
}

export default ({
  apiKey,
  query,
  type = "places",
  debounceMs = 400,
  options = {}
}: IAutocompleteProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const id = uuid();
  const sessionToken = React.useRef<string>(id);
  const sessionTokenTimeout = React.useRef<number>(null);
  const abortController = React.useRef<any>(null);
  const abortSignal = React.useRef<any>(null);
  const placesAbortController = React.useRef<any>(null);
  const placesAbortSignal = React.useRef<any>(null);

  React.useEffect(() => {
    sessionTokenTimeout.current = window.setInterval(resetSessionToken, 180000);
    abortController.current = new AbortController();
    abortSignal.current = abortController.current.signal;
    placesAbortController.current = new AbortController();
    placesAbortSignal.current = placesAbortController.current.signal;
    // tslint:disable-next-line:no-unused-expression
    placesAbortController.current;
    return () => {
      clearInterval(sessionTokenTimeout.current);
      abortController.current.abort();
      placesAbortController.current.abort();
    };
  }, []);

  const initialRender = React.useRef<boolean>(false);

  const debouncedFn = React.useRef<any>(null);

  React.useEffect(() => {
    if (initialRender.current === false) {
      initialRender.current = true;
      return;
    }

    if (debouncedFn.current) {
      debouncedFn.current.clear();
    }

    if (query.length === 0) {
      dispatch({
        type: "INVALID_REQUEST"
      });
      return;
    }

    if (!state.isLoading && !abortController.current.signal.aborted) {
      dispatch({
        type: "LOADING"
      });
    }

    debouncedFn.current = debounce(() => {
      const types =
        options.types && type === "places" ? `&types=${options.types}` : "";
      const strictbounds =
        options.strictbounds && types === "places" ? `&strictbounds` : "";
      const offset =
        options.offset && type === "query" ? `&offset=${options.offset}` : "";
      const language = options.language ? `&language=${options.language}` : "";
      const location = options.location ? `&location=${options.location}` : "";
      const radius = options.radius ? `&radius=${options.radius}` : "";

      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}${types}${language}${location}${radius}${strictbounds}${offset}&key=${apiKey}&sessiontoken=${sessionToken.current}`;
      fetch(url, { signal: abortSignal.current })
        .then(data => data.json())
        .then(data => {
          dispatch({
            type: data.status,
            payload: {
              data
            }
          });
        })
        .catch(() => {
          if (abortController.current.signal.aborted) {
            abortController.current = new AbortController();
            abortSignal.current = abortController.current.signal;
          }
        });
    }, debounceMs);

    debouncedFn.current();
  }, [
    query,
    debounceMs,
    apiKey,
    options.types,
    options.language,
    options.location,
    options.radius,
    options.strictbounds,
    options.offset,
    type
  ]);

  const resetSessionToken = () => {
    sessionToken.current = id;
  };

  const cancelQuery = (prediction: any) => {
    if (abortController.current) {
      abortController.current.abort();
    }
    dispatch({
      type: "OK",
      payload: {
        data: {
          predictions: [prediction]
        }
      }
    });
  };
  return {
    results: state.results,
    isLoading: state.isLoading,
    error: state.error,
    cancelQuery
  };
};

const reducer = (
  state: any,
  action: {
    type: string;
    payload?: any;
  }
) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        isLoading: true
      };
    case "OK":
      return {
        ...state,
        results: action.payload.data,
        isLoading: false,
        error: null
      };
    case "OVER_QUERY_LIMIT":
      return {
        ...state,
        isLoading: false,
        error: `Over query limit.`
      };
    case "OVER_DAILY_LIMIT":
      return {
        ...state,
        isLoading: false,
        error: `Over query limit.`
      };
    case "ZERO_RESULTS":
      return {
        ...state,
        results: {
          predictions: []
        },
        isLoading: false,
        error: `No results — try another input.`
      };
    case "INVALID_REQUEST":
      return {
        ...state,
        isLoading: false,
        error: null
      };
    case "REQUEST_DENIED":
      return {
        ...state,
        isLoading: false,
        error: `Invalid 'key' parameter.`
      };
    case "UNKNOWN_ERROR":
      return {
        ...state,
        isLoading: false,
        error: `Unknown error, refresh and try again.`
      };
    default:
      return state;
  }
};

function debounce(func: () => any, wait: number, immediate?: boolean) {
  let timeout: any;
  const executedFunction = function(this: any) {
    let context = this;
    let args: any = arguments;

    // tslint:disable-next-line:only-arrow-functions
    let later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };

  // tslint:disable-next-line:only-arrow-functions
  executedFunction.clear = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return executedFunction;
}
