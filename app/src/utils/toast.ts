import { toaster } from '@chakra/toaster';

export const showGenericErrorToast = () =>
  toaster.create({
    title: 'We had a problem with your request.  Please try again later.',
    type: 'error',
  });
