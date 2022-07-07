import NextErrorComponent, { ErrorProps } from 'next/error';

import { captureException, flush } from '@sentry/nextjs';
import type { NextPage, NextPageContext } from 'next/types';

export interface AppErrorProps extends ErrorProps {
  err?: Error;
  hasGetInitialPropsRun?: boolean;
}

const AppError: NextPage<AppErrorProps> = ({ statusCode, hasGetInitialPropsRun, err }) => {
  if (!hasGetInitialPropsRun && err) {
    captureException(err);
  }

  return <NextErrorComponent statusCode={statusCode} />;
};

AppError.getInitialProps = async (context: NextPageContext) => {
  const errorInitialProps: AppErrorProps = await NextErrorComponent.getInitialProps(context);

  errorInitialProps.hasGetInitialPropsRun = true;

  if (context.err) {
    captureException(context.err);
    await flush(2000);
    return errorInitialProps;
  }

  return errorInitialProps;
};

export default AppError;
