export const upcase = (str: string | undefined = ''): string => {
    return str ? str[0].toUpperCase() + str.slice(1) : '';
  };
export const lowcase = (str: string) => str[0] ? str[0].toLowerCase() + str.slice(1) : str;
