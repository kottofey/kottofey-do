export { ApiClient } from './http/api';
export { default as serializeQuery } from './http/serializeQuery';
export { ApiError } from './http/error';

import { ApiClient } from './http/api';

export const api = new ApiClient();
