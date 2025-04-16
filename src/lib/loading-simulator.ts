// Enable/disable loading simulation
export const IS_ENABLED = process.env.NODE_ENV === 'development' && false;

// Default delay in milliseconds
const DEFAULT_DELAY = 20000;

export async function loadingSimulator(waitFor: number = DEFAULT_DELAY) {
  if (!IS_ENABLED) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, waitFor));
}
