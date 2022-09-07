export function convertCreditsToEuros(credits: number) {
  return (credits * 1.2).toFixed(2); // https://community.resonate.coop/t/pricing-and-credits/1854
}
