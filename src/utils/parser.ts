export const parsePostgresConnectionString = (connString: string) => {
  const regex =
    /^(?:postgres(?:ql)?:\/\/)([^:]+)(?::([^@]+))?@([^:\/]+)(?::(\d+))?(?:\/(.+))?$/;
  const match = connString.match(regex);

  if (!match) {
    throw new Error('Invalid PostgreSQL connection string');
  }

  const [, username, password, host, port, database] = match;

  return {
    host,
    username,
    password,
    port: port ? parseInt(port) : undefined,
    database,
  };
};

// map poll option to emoji lowercased alphabet
export const numberToEmoji = (num: number) => {
  return `:regional_indicator_${String.fromCharCode(97 + num)}:`;
};
