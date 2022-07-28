
function wait (howLong: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, howLong);
  });
}

export function timeoutPromise<T> (
  promise: Promise<T>,
  timeout: number,
  fallbackValue?: T,
): Promise<T> {
  const fallbackPromise = fallbackValue
    ? Promise.resolve(fallbackValue)
    : Promise.reject(new Error("Timeout"));
  return Promise.race([promise, wait(timeout).then(() => fallbackPromise)]);
}

export const getCountry = async (): Promise<string> =>
  await (await fetch("https://ipapi.co/country/")).text();

export const log = console.log.bind(console, "[visitor counter client]");

export const isNonZeroString = (str: string|undefined|null): str is string =>
  ![null, undefined, ""].includes(str);
