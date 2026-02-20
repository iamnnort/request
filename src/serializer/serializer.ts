import { stringify } from 'qs';
import { SerializerArrayFormats, SerializerConfig } from './serializer.types';
import { ParamsSerializerOptions } from 'axios';

export class Serializer {
  private config: Required<SerializerConfig>;

  constructor(config: Partial<SerializerConfig> = {}) {
    this.config = {
      arrayFormat: SerializerArrayFormats.BRACKETS,
      ...config,
    };
  }

  getConfig(): ParamsSerializerOptions {
    return {
      serialize: (params: any) => {
        return stringify(params, {
          arrayFormat: this.config.arrayFormat,
          skipNulls: true,
        });
      },
    };
  }
}
