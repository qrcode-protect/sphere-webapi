"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 04/05/2022 at 10:51
 * File src/Common/Model
 */

import Application          from "@ioc:Adonis/Core/Application"
import {
    CollectionReference,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    FieldPath,
    Firestore,
    OrderByDirection,
    Query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    WhereFilterOp
}                           from "@google-cloud/firestore";
import { ClassConstructor } from "class-transformer";
import { firestore }        from "firebase-admin";

interface ModelConstructor {
    collectionName: string;
    firebaseAppName?: string;
    model: ClassConstructor<any>;
}

export default class Model {
    collection: CollectionReference;
    instance: Firestore;
    firebaseAppName?: string;
    model: ClassConstructor<any>;

    snapshot: Query<DocumentData>;

    constructor({ collectionName, firebaseAppName, model }: ModelConstructor) {
        this.firebaseAppName = firebaseAppName;
        this.instance = Application.container.use("db");
        this.collection = this.instance.collection(collectionName);
        this.model = model;
    }

    _objectModel() {
        return new this.model()
    }

    createWithAttributes(attributes) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const object: any = this;
        Object.keys(attributes).forEach((key) => object[key] = attributes[key]);


        const item = [
            // "collection",
            // "instance",
            // "firebaseAppName",
            // "model",
        ];

        item.forEach((attribute) => delete object[attribute]);

        return object;
    }

    cleanup(data) {
        const object: any = new this.model(data);

        const item = [
            "collection",
            "instance",
            "firebaseAppName",
            "model",
        ];

        item.forEach((attribute) => delete object[attribute]);

        return object;
    }

    private static _now(): Date {
        return firestore.Timestamp.now().toDate()
    }

    async all(): Promise<any[]> {
        const documentsRefs = await this.collection.listDocuments();
        const object = this._objectModel()

        const results: (typeof object)[] = [];
        for (const documentSnapshot of documentsRefs) {
            results.push(this.casting((await documentSnapshot.get()).data()));
        }
        return results;
    }

    async store(data): Promise<any> {
        if (!data.id) {
            data.id = "";
        }

        data.createdAt = Model._now();
        data.updatedAt = Model._now();

        const documentReference: DocumentReference = await this.collection.add({ ...this.cleanup(data) });
        await documentReference.update({ id: documentReference.id })
        return this.casting({ ...data, id: documentReference.id, });
    }

    async update(docID: string, data, force = false): Promise<any> {
        if (docID.trim() === "")
            return null;

        const documentReference: DocumentReference = (await this.collection.doc(docID))
        data.updatedAt = Model._now();
        if (force) {
            await documentReference.set({ ...this.cleanup(data) })
        } else {
            await documentReference.update({ ...this.cleanup(data) })
        }

        return this.doc(docID)
    }

    async delete(docID: string): Promise<boolean> {
        if (docID.trim() === "")
            return false;

        return new Promise<boolean>((resolve, reject) => {
            this.collection.doc(docID)
                .delete()
                .then(() => resolve(true))
                .catch(() => reject(false))
        })

    }

    private casting(data) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return (new this.model()).createWithAttributes(data);
    }

    // async docs() {
    //     return (await this.collection.docs()).docs.map((doc: QueryDocumentSnapshot) => this.casting(doc.data()))
    // }

    async doc(docID: string) {
        if (docID.trim() === "")
            return null;
        const documentData: DocumentSnapshot = await (await this.collection.doc(docID)).get()
        return documentData.exists ? this.casting(documentData.data()) : null;
    }

    async where(column: string, value: string | string[] | number, operator: WhereFilterOp = "=="): Promise<any[] | null> {
        let snapshot: QuerySnapshot;

        if (this.snapshot)
            snapshot = await this.snapshot.where(column, operator, value).get()
        else
            snapshot = await this.collection.where(column, operator, value).get();
        if (snapshot.empty) {
            return null;
        }
        return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => this.casting(doc.data()))
    }

    whereSnapshot(column: string, value: string | string[] | number, operator: WhereFilterOp = "=="): this {
        this.snapshot = (this.snapshot ?? this.collection).where(column, operator, value)
        return this;
    }

    public async findOneBy(column: string, value: string): Promise<any> {
        const data = await this.where(column, value)
        return data ? data[0] || null : data
    }

    async get(snapshot?: QuerySnapshot): Promise<any[] | null> {

        if (this.snapshot) {
            snapshot = await this.snapshot.get()
        }

        if (!snapshot || snapshot.empty) {
            return null;
        }

        return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => this.casting(doc.data()))
    }

    orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): this {

        if (this.snapshot) {
            this.snapshot = this.snapshot.orderBy(fieldPath, directionStr)
        }

        return this
    }
}
