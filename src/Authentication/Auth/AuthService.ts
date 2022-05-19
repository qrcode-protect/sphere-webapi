"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 18/05/2022 at 14:08
 * File src/Authentication/AuthService
 */

import Service                           from "QRCP/Sphere/Common/Service";
import { Auth }                          from "firebase-admin/auth";
import Application                       from "@ioc:Adonis/Core/Application";
import { Error as SofiakbError, Result } from "@sofiakb/adonis-response";
import User                              from "QRCP/Sphere/User/User";
import { apiTokenModel, userModel }      from "App/Common/model";
import { Auth as firebaseAuth }          from "firebase/auth";
import Jwt                               from "QRCP/Sphere/Authentication/Jwt";
import ApiToken                          from "QRCP/Sphere/Authentication/ApiToken/ApiToken";
import { currentApiToken, currentUser }  from "App/Common/auth";
import { JWT }                           from "jose";
import jwtConfig                         from "Config/jwt";
import { appUrl }                        from "Config/app";
import firebaseConfig                    from "Config/firebase";
import ApiTokenAttributes                from "QRCP/Sphere/Authentication/ApiToken/ApiTokenAttributes";
import { firestore }                     from "firebase-admin";
import SignOptions = JWT.SignOptions;


export default class AuthService extends Service {

    auth: Auth = <Auth>Application.container.use("firebase.auth")
    clientAuth: firebaseAuth = <firebaseAuth>Application.container.use("firebase.clientAuth")

    jwt: Jwt = <Jwt>Application.container.use("jwt");
    apiTokenModel: ApiToken = apiTokenModel();
    userModel: User = userModel();

    constructor(model = User) {
        super(model);
    }

    /**
     * Retrieve current user.
     *
     * @return Promise<User|SofiakbError>
     */
    public user(bearerToken: string | null): Promise<User | SofiakbError> {

        return new Promise(async (resolve) => {

            if (bearerToken === null || bearerToken.trim() === "" || !this.jwt.verify(bearerToken))
                return resolve(Result.unauthorized());

            const user = await currentUser(bearerToken)

            if (user === null)
                return resolve(Result.unauthorized());

            return resolve(user);
        });
    }

    /**
     * Logout user.
     *
     * @return Promise<boolean>
     */
    public async logout(bearerToken: string | null): Promise<boolean> {

        return new Promise(async (resolve) => {
            if (bearerToken === null || bearerToken.trim() === "" || !this.jwt.verify(bearerToken))
                return resolve(true);

            const apiToken = await currentApiToken(bearerToken);

            if (apiToken !== null) {
                await this.apiTokenModel.delete(apiToken.id);
            }

            return resolve(true);
        });
    }

    /**
     * Retrieve if current user is logged.
     *
     * @return Promise<boolean>
     */
    public async logged(bearerToken: string | null): Promise<boolean> {
        return new Promise((resolve) => {
            this.user(bearerToken)
                .then(() => resolve(true))
                .catch(() => resolve(false))
        })
    }

    /**
     * @param email
     * @return User|null
     */
    public async loadUserByEmail(email: string): Promise<User | null> {
        return await userModel().whereEmail(email);
    }

    /**
     * @param username
     * @return User|null
     */
    public async loadUserByUsername(username: string): Promise<User | null> {
        return await userModel().whereUsername(username);
    }

    /**
     * User not exists.
     *
     */
    public notExists() {
        return Result.unauthorized("Le nom d'utilisateur ou l'adresse mail n'existe pas");
    }

    /**
     * Wrong password.
     *
     */
    public wrongPassword() {
        return Result.unauthorized("Le mot de passe est incorrect");
    }

    /**
     * Account is not active.
     *
     */
    public notActive() {
        return Result.forbidden("Votre compte n'est pas encore actif. Merci de bien vouloir valider votre adresse e-mail.");
    }

    /**
     * Unauthorized.
     *
     */
    public unauthorized() {
        return Result.forbidden("Vous n'êtes pas autorisé à accéder à ce service.");
    }

    /**
     * @return int
     * @param remember
     */
    public getTTL(remember = false) {
        return remember ? 525600 : jwtConfig.ttl * 60;
    }

    /**
     * @param values
     * @param fields
     * @param validator
     * @return boolean
     */
    public validate(values: any, fields?: string[], validator?: any) {
        validator = validator ?? [
            "lastname",
            "firstname",
            "username",
            "email",
            "password",
        ];

        fields = (fields?.length || 0) === 0 ? validator : fields

        let valid = true

        fields?.forEach((field: string) => {
            if (typeof values[field] === "undefined" || values[field] === null || values[field].trim() === "") {
                valid = false
            }
        })

        return valid;
    }

    /**
     * Generate token
     *
     * @return string
     * @param user
     * @param remember
     */
    public generateToken(user: User, remember = false): string {
        const signOptions: SignOptions = {
            algorithm: "HS256",
            audience : firebaseConfig.projectId,
            expiresIn: this.getTTL(remember).toString(),
            issuer   : appUrl,
            subject  : user.uid,
        }

        const payload = {
            user: {
                firstname: user.firstname,
                lastname : user.lastname,
                email    : user.lastname,
                id       : user.id,
                uid      : user.uid
            },
        }

        return this.jwt.encode(payload, signOptions)
    }

    public async registerApiToken(user: User, bearerToken: string) {
        const attributes: ApiTokenAttributes = {
            loggedAt: firestore.Timestamp.now().toDate(),
            token   : bearerToken,
            uid     : user.uid,
            userId  : user.id
        }

        const apiToken = await this.apiTokenModel.findOneBy("userId", user.id)

        if (apiToken === null) {
            await this.apiTokenModel.store(attributes)
        } else await this.apiTokenModel.update(apiToken.id, attributes)

    }


}
