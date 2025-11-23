function getErrorMessage(
  error: any,
  defaultMessage: string = "An unexpected error occurred"
): string {
  // @ts-ignore
  return (
    error?.detail?.[0]?.msg ??
    error?.detail?.message ??
    error?.detail ??
    error?.error ??
    defaultMessage
  );
}

function getErrorCode(error: any): string {
  // @ts-ignore
  return error?.detail?.[0]?.code ?? error?.detail?.code ??  "";
}

const getVerifySignupUrl = (token: string): string => {
  return `/verify-signup?token=${encodeURIComponent(token)}`;
};

const getVerifyLoginUrl = (token: string): string => {
  return `/verify-login?token=${encodeURIComponent(token)}`;
};

const cleanPath = () => {
  const clean = window.location.pathname;
  window.history.replaceState({}, "", clean);
};

export { getErrorMessage, getVerifySignupUrl, getVerifyLoginUrl, cleanPath, getErrorCode };
