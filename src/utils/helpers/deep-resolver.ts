const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

async function deepResolvePromises(input: unknown): Promise<unknown> {
  if (input instanceof Promise) {
    return deepResolvePromises(await input);
  }

  if (Array.isArray(input)) {
    const resolvedArray = await Promise.all(input.map(deepResolvePromises));
    return resolvedArray;
  }

  if (input instanceof Date) {
    return input;
  }

  if (isRecord(input)) {
    const keys = Object.keys(input);
    const resolvedObject: Record<string, unknown> = {};

    for (const key of keys) {
      const resolvedValue = await deepResolvePromises(input[key]);
      resolvedObject[key] = resolvedValue;
    }

    return resolvedObject;
  }

  return input;
}

export default deepResolvePromises;
