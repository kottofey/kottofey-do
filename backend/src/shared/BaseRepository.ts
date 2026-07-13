import { Model } from 'sequelize-typescript';
import {
  FindOptions,
  Attributes,
  CreationAttributes,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  RestoreOptions,
  ModelStatic,
  ScopeOptions,
} from 'sequelize';

export abstract class BaseRepository<M extends Model> {
  protected constructor(protected model: ModelStatic<M>) {}

  async findAndCountAll(
    options?: FindOptions<Attributes<M>>,
  ): Promise<{ rows: M[]; count: number }> {
    return await this.model.findAndCountAll(options);
  }

  async findByPk(id: number | string, options?: FindOptions<Attributes<M>>): Promise<M | null> {
    return await this.model.findByPk(id, options);
  }

  async findOne(options?: FindOptions<Attributes<M>>): Promise<M | null> {
    return await this.model.findOne(options);
  }

  async create(data: CreationAttributes<M>, options?: CreateOptions<Attributes<M>>): Promise<M> {
    return await this.model.create(data, options);
  }

  async update(
    id: number | string,
    data: Partial<Attributes<M>>,
    options?: UpdateOptions<Attributes<M>>,
  ): Promise<M | null> {
    const instance = await this.findByPk(id);
    if (!instance) return null;
    return await instance.update(data, options);
  }

  async delete(id: number | string, options?: DestroyOptions<Attributes<M>>): Promise<boolean> {
    const instance = await this.findByPk(id);
    if (!instance) return false;
    await instance.destroy(options);
    return true;
  }

  async restore(id: number | string, options?: RestoreOptions<Attributes<M>>): Promise<M | null> {
    const instance = await this.model.findByPk(id, { paranoid: false });
    if (instance) {
      await instance.restore(options);
      return instance;
    }
    return null;
  }

  protected getScopedModel(
    scopes: string | ScopeOptions | (string | ScopeOptions)[] | undefined,
  ): ModelStatic<M> {
    return this.model.scope(scopes);
  }
}
