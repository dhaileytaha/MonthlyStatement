/**
 * Checks if both addresses are the same. Somehow there can be a little difference in
 * capitalisation between addresses. So we remove the capitalisation
 */
export const isSameAddress = (address1?: string, address2?: string) => {
  if (!address1 && !address2) {
    return true;
  }
  if (!address1 || !address2) {
    return false;
  }
  return address1.toLowerCase() === address2.toLowerCase();
};
