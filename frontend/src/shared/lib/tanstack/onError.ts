import { ApiError } from '@/shared/api/http/error';

export const getErrorMessage = ({ error }: { error: Error }) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Произошла неизвестная ошибка';
};
