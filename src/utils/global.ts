export const sortBy = (key: any, mode: 'asc'|'desc' = 'asc' ) => {
    if (mode === 'desc') {
      return (a: any, b: any) => (a[key] < b[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0);
    }
    return (a: any, b: any) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
  };