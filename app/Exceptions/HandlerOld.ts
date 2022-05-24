/* eslint-disable */
/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

// @ts-ignore
import Logger from '@ioc:Adonis/Core/Logger';
// @ts-ignore
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';
// @ts-ignore
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// @ts-ignore
import Log from '@sofiakb/adonis-logger';

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  handle(error: any, ctx: HttpContextContract): Promise<any> {
    // Log.error(error, true);
    return super.handle(error, ctx);
  }
}
