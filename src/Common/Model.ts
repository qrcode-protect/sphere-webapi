"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 04/05/2022 at 10:51
 * File src/Common/Model
 */

import Application                                                       from "@ioc:Adonis/Core/Application"
import { DocumentData, Firestore, QueryDocumentSnapshot, QuerySnapshot } from "@google-cloud/firestore";
import { ClassConstructor }                                              from "class-transformer";

interface ModelConstructor {
    collectionName: string;
    firebaseAppName?: string;
    model: ClassConstructor<unknown>;
}

export default class Model {
    collection;
    instance: Firestore;
    firebaseAppName?: string;
    model: ClassConstructor<unknown>;

    constructor({ collectionName, firebaseAppName, model }: ModelConstructor) {
        this.firebaseAppName = firebaseAppName;
        this.instance = Application.container.use("db");
        this.collection = this.instance.collection(collectionName);
        this.model = model;
    }

    _objectModel() {
        return new this.model({ childOnly: true })
    }

    createWithAttributes(attributes) {
        const object: any = this._objectModel();
        Object.keys(attributes).forEach((key) => object[key] = attributes[key]);

        [
            "collection",
            "instance",
            "firebaseAppName",
            "model",
        ].forEach((attribute) => delete object[attribute]);

        return object;
    }

    async all() {
        const documentsRefs = await this.collection.listDocuments();
        const object = this._objectModel()

        const results: (typeof object)[] = [];
        for (const documentSnapshot of documentsRefs) {
            results.push(this.casting((await documentSnapshot.get()).data()));
        }
        return results;
    }

    private casting(data) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return this.createWithAttributes(data);
    }

    async docs() {
        return (await this.collection.docs()).docs.map((doc: QueryDocumentSnapshot) => this.casting(doc.data()))
    }

    async doc(docID: string) {
        return (await this.collection.doc(docID)).data()
    }

    async where(column: string, value: string, operator = "=="): Promise<any[] | null> {
        const snapshot: QuerySnapshot = await this.collection.where(column, operator, value).get();
        if (snapshot.empty) {
            console.log("No matching documents.");
            return null;
        }
        return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => this.casting(doc.data()))
    }
}
