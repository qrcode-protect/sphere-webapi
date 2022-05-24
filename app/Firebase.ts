"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 04/05/2022 at 11:00
 * File app/Firebase
 */

import { Firestore }                              from "@google-cloud/firestore";
import { Bucket, Storage }                        from "@google-cloud/storage";
import { cert, initializeApp }                    from "firebase-admin/app";
import { Auth, getAuth }                          from "firebase-admin/auth";
import { initializeApp as firebaseInitializeApp } from "firebase/app";
import { getAuth as webGetAuth, Auth as webAuth } from "firebase/auth";

import firebaseConfig                             from "Config/firebase";


interface FirebaseConstructor {
    projectId: string;
    keyFilename: string;
}

export default class Firebase {
    private readonly _db: Firestore;
    private readonly _storage: Storage;
    private readonly _storageBucket: Bucket;
    private readonly _auth: Auth;
    private readonly _clientAuth: webAuth;

    constructor({ projectId, keyFilename }: FirebaseConstructor) {
        this._db = new Firestore({
            projectId  : projectId,
            keyFilename: keyFilename,
        });

        this._storage = new Storage({
            projectId  : projectId,
            keyFilename: keyFilename,
        });

        this._storageBucket = this._storage.bucket(`${projectId}.appspot.com`);

        const dataFirebaseConfig = require(keyFilename)

        const firebaseApp = firebaseInitializeApp({
            apiKey           : firebaseConfig.web.apiKey,
            authDomain       : firebaseConfig.web.authDomain,
            projectId        : firebaseConfig.web.projectId,
            storageBucket    : firebaseConfig.web.storageBucket,
            messagingSenderId: firebaseConfig.web.messagingSenderId,
            appId            : firebaseConfig.web.appId,
        })
        this._clientAuth = webGetAuth(firebaseApp)

        const firebaseAdminApp = initializeApp({ credential: cert(dataFirebaseConfig) })
        this._auth = getAuth(firebaseAdminApp)

    }

    get db(): FirebaseFirestore.Firestore {
        return this._db;
    }

    get storage(): Storage {
        return this._storage;
    }

    get storageBucket(): Bucket {
        return this._storageBucket;
    }

    get auth(): Auth {
        return this._auth;
    }

    get clientAuth(): webAuth {
        return this._clientAuth;
    }
}

