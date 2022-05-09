"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 04/05/2022 at 10:47
 * File src/Common/Service
 */

import { Result }           from "@sofiakb/adonis-response";
import { size, each }       from "lodash"
import Log                  from "QRCP/Sphere/Common/Log";
import Model                from "QRCP/Sphere/Common/Model";
import { ClassConstructor } from "class-transformer";


export default class Service {

    private model

    constructor(model: ClassConstructor<Model>) {
        this.model = new model
    }

    public all = async () => Result.success(await this.model.all())

    public findById = async (id: number | string, columnID = "id") => this.findOneBy(columnID, id)

    public findBy = async (column: string, value: unknown) => {
        try {
            const data = await this.model.query().where(column, value)
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public findOneBy = async (column: string, value: unknown) => {
        try {
            const data = (await this.model.where(column, value))[0] || null
            return data === null ? Result.notFound(`La ressource #${value} demandée n'existe pas.`) : Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.error()
        }
    }

    public search = async (query, searchable: string[] = []) => {
        if (size(searchable) === 0 || searchable === null)
            searchable = this.model?.searchable || []
        query = `%${query}%`.toLowerCase().trim()

        if (query === "")
            return Result.success(await this.model.all())

        let queryBuilder = this.model
            .query()

        each(searchable, item => queryBuilder = queryBuilder.orWhere(item, "LIKE", query))

        return Result.success(await queryBuilder)
    }

    public paginate = async (page: number, limit: number) => {
        const total = await this.model.count();
        const latest = Math.ceil(total / limit);

        page = Math.max(page - 1, 0)

        return Result.success({
            page : page + 1,
            data : await this.model.query().offset(page * limit).limit(limit),
            first: 0,
            latest,
            per  : limit,
            prev : page <= 0 ? null : page,
            next : page + 1 >= latest ? null : page + 2,
            total
        });
    }

    public store = async (data: any) => {
        try {
            const result = await this.model.create(data)
            if (result.$isPersisted)
                return Result.success(result)
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public update = async (value: unknown, updatable, column = "id") => {
        try {
            const data = await this.model.query().where(column, value).update(updatable)
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.notFound(`La ressource #${value} demandée n'existe pas.`)
        }
    }

    public destroy = async (value: unknown, column = "id") => {
        try {
            const data = await this.model.findByOrFail(column, value)
            return Result.success(await data.delete())
        } catch (e) {
            Log.error(e, true)
            return Result.notFound(`La ressource #${value} demandée n'existe pas.`)
        }
    }

}
