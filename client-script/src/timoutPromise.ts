
function wait (howLong: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, howLong);
  });
}

export async function timeoutPromise<T> (
  promise: Promise<T>,
  timeout: number,
  fallbackValue?: T,
): Promise<T> {
  const fallbackPromise = fallbackValue
    ? Promise.resolve(fallbackValue)
    : Promise.reject(new Error("Timeout"));
  return Promise.race([promise, wait(timeout).then(() => fallbackPromise)]);
}
