export type SerializerConfig = {
  arrayFormat: SerializerArrayFormats;
};

export enum SerializerArrayFormats {
  INDICES = 'indices',
  BRACKETS = 'brackets',
  REPEAT = 'repeat',
  COMMA = 'comma',
}
