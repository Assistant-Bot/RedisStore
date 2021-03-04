import { Base, DataStore, Payload } from 'https://deno.land/x/assistantlib@v1.0.0-alpha.2/mod.ts'
import { connect, Redis, RedisConnectOptions } from 'https://deno.land/x/redis@v0.19.0/mod.ts';
import { promisify } from 'https://deno.land/std@0.89.0/node/util.ts';

export default class RedisStore<K extends string, V extends Base> extends DataStore<K, V> {

	#redis!: Redis;

	public constructor(structure: V, limit?: number) {
		super(structure, limit);
	}

	public async connect(options: RedisConnectOptions) {
		this.#redis = await connect(options);
	}

	public async update(structure: V): Promise<V> {
		if (await this.has(structure.id as K)) {
			let cache: V = (await this.get(structure.id as K) as V);
			cache.update(structure as any);
			return cache;
		} else {
			this.#redis.set(structure.id as K, JSON.stringify(structure));
			return structure;
		}
	}
	
	public async add(idOrData: K | Payload, append: boolean = true): Promise<V | null> {
		if (await this.size >= this.limit && append) {
			// this.#redis.lpop(); // No ?
			console.error('Redis Store does not support finite data storing');
		} else {
			return null;
		}
		if (typeof idOrData === 'string') {
			if (await this.has(idOrData)) {
				return null;
			} else {
				// @ts-ignore
				await this.#dataSet.set(idOrData, new this.structure(idOrData));
				return await this.get(idOrData);
			}
		} else {
			if (await this.has(idOrData.d.id)) {
				return null;
			} else {
				// @ts-ignore
				await this.#dataSet.set(idOrData.d.id, new this.structure(idOrData.d));
				return await this.get(idOrData.d.id);
			}
		}
	}

	public async has(id: K): Promise<boolean> {
		return !!(await this.get(id));
	}

	public async delete(id: K): Promise<boolean> {
		return await this.delete(id);
	}

	public async get(id: K): Promise<V | null> {
		const res = await this.#redis.get(id);
		if(res) {
			return JSON.parse(res) as V;
		} else {
			return null;
		}
	}

	// Yeah John's not gonna like this
	// @ts-ignore
	public get size(): Promise<number> {
		return promisify(this.#redis.dbsize)();
	}

	// Yeah John's not honna like this
	[Symbol.asyncIterator]: AsyncIterator<V>
	// @ts-ignore
	public async values(): Promise<AsyncIterator<V, number, undefined>> {
		// @ts-ignore
		return (await this.#redis.keys("*"))[Symbol.asyncIterator]();
	}

	public async set(id: K, structure: V, overwrite: boolean = false): Promise<V | null> {
		if (await this.size >= this.limit && overwrite) {
			// this.#redis.lpop()
		}
		await this.#redis.set(id, JSON.stringify(structure));
		return structure ?? null;
	}

}