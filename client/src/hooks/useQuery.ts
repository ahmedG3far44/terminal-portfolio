import { useState, useEffect, useCallback, useRef } from 'react';

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useQuery<T>(
  fetcher: (signal?: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
): QueryState<T> & { refetch: () => void } {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const execute = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ data: null as T | null, loading: true, error: null });

    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err: Error) => {
        if (!controller.signal.aborted) {
          setState({
            data: null,
            loading: false,
            error: err.message || 'An error occurred',
          });
        }
      });
  }, deps);

  useEffect(() => {
    execute();
    return () => abortRef.current?.abort();
  }, [execute]);

  return { ...state, refetch: execute };
}

interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useMutation<T, A extends unknown[]>(
  fetcher: (...args: A) => Promise<T>,
): MutationState<T> & { mutate: (...args: A) => Promise<T> } {
  const [state, setState] = useState<MutationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (...args: A) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await fetcher(...args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (err: any) {
        const message = err.message || 'An error occurred';
        setState({ data: null, loading: false, error: message });
        throw err;
      }
    },
    [fetcher],
  );

  return { ...state, mutate };
}
