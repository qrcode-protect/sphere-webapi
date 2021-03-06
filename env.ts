/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from "@ioc:Adonis/Core/Env"

export default Env.rules({
    HOST: Env.schema.string({ format: "host" }),
    PORT: Env.schema.number(),

    APP_KEY : Env.schema.string(),
    APP_NAME: Env.schema.string(),
    APP_URL : Env.schema.string(),

    WEBSITE_URL : Env.schema.string(),
    DASHBOARD_URL : Env.schema.string(),
    PARTNER_URL : Env.schema.string(),
    WEBAPP_URL : Env.schema.string(),

    ADMIN_IPS : Env.schema.string(),

    DRIVE_DISK: Env.schema.enum([ "local" ] as const),

    NODE_ENV: Env.schema.enum([ "development", "production", "test", "local" ] as const),

    FIREBASE_KEY_FILE            : Env.schema.string(),
    FIREBASE_PROJECT_ID         : Env.schema.string(),

    SMTP_HOST: Env.schema.string({ format: "host" }),
    SMTP_PORT: Env.schema.number(),
    SMTP_USERNAME: Env.schema.string(),
    SMTP_PASSWORD: Env.schema.string(),

    MAIL_CONTACT_RECIPIENTS: Env.schema.string(),

    JWT_SECRET: Env.schema.string(),
    JWT_TTL: Env.schema.number.optional(),
})
