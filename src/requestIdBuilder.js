import { hashCode } from 'hashcode';

export default request => hashCode().value(`${request.method} ${JSON.stringify(request.headers)} ${request.url}`);
