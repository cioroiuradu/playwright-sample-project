export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getProjectValue() {
  let value = null;
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i].startsWith("--project=")) {
      value = process.argv[i].split("=")[1]; // Split the argument by '=' and get the second part
      break;
    }
  }
  return value;
}
