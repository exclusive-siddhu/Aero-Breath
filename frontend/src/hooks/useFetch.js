import { useState, useEffect, useCallback, useRef } from "react";

export const useFetch = (fetchFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mounted = useRef(false);
  const requestId = useRef(0);

  const execute = useCallback(async () => {
    if (!mounted.current) return undefined;

    const currentRequest = ++requestId.current;
    setError(null);

    if (typeof fetchFn !== "function") {
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    try {
      const response = await fetchFn();
      const result =
        response?.data !== undefined ? response.data : response;

      if (mounted.current && currentRequest === requestId.current) {
        setData(result);
      }

      return result;
    } catch (err) {
      if (mounted.current && currentRequest === requestId.current) {
        setError(err);
      }

      return undefined;
    } finally {
      if (mounted.current && currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, [fetchFn]);

  useEffect(() => {
    mounted.current = true;
    execute();

    return () => {
      mounted.current = false;
      requestId.current += 1;
    };
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch: execute
  };
};

export default useFetch;