import { GraphQLError } from 'graphql';

export function formatErrorConfig(error: GraphQLError) {
  if (isBusinessError(error)) {
    return {
      message: 'Pantheon Error',
      extensions: {
        pantheonErrors: error.extensions.exception,
      },
    };
  }
  return error;
}

function isBusinessError(error: GraphQLError): boolean {
  return (
    Array.isArray(error.extensions.exception) &&
    !!error.extensions.exception
  );
}
