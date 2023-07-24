export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  if (!match) return '+7 ';
  const intlCode = match[1] ? `+7 ` : '';
  const part1 = match[2] ? `(${match[2]}` : '';
  const part2 = match[3] ? `) ${match[3]}` : '';
  const part3 = match[4] ? `-${match[4]}` : '';
  const part4 = match[5] ? `-${match[5]}` : '';
  return intlCode + part1 + part2 + part3 + part4;
};
