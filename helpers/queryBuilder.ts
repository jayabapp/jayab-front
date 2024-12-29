type queryBuilderType = { [key: string]: any };

const queryBuilder = (body: queryBuilderType) => {
  const cleanData = Object.entries(body)
    .filter(([key, value]) => value !== undefined)
    .reduce((obj: any, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  const createQueryString = () => {
    const params = new URLSearchParams(cleanData);

    return params.toString();
  };

  return createQueryString().toString();
};

export default queryBuilder;
