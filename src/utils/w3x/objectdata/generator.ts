import { MappedData } from '../../mappeddata';

function pascalCase(what: string): string {
  return what.replace(/[-()]/g, ' ').replace(/'/g, '').replace(/\+/g, 'Plus').replace(/ +/g, ' ').trim().split(' ').map((word) => `${word[0].toUpperCase()}${word.slice(1)}`).join('');
}

function camelCase(what: string): string {
  const pascal = pascalCase(what);

  return `${pascal[0].toLowerCase()}${pascal.slice(1)}`;
}

function generateObjectsEnum(data: MappedData): string[] {
  const map = new Map<string, string>();
  for (const [key, value] of Object.entries(data.map)) {
    let name = value.string('Name');

    if (!name) {
      name = value.string('Name:melee,V0');
    }

    if (name) {
      name = pascalCase(name);

      if (map.has(name)) {
        for (let suffix = 2; suffix < 10; suffix++) {
          if (!map.has(name + suffix)) {
            name = name + suffix;
            break;
          }
        }
      }

      map.set(name, key);
    } else {
      console.log('NO NAME', key, value);
    }
    
  }

  const flat = [];

  for (const [key, value] of map) {
    flat.push(`  ${key} = '${value}',`);
  }

  flat.sort();

  return flat;
}

interface ObjectProperty {
  name: string;
  tsType: string;
  getter: string;
  setter: string;
}

function generateObjectFunctions(weStrings: MappedData, metaData: MappedData): { unitProps: ObjectProperty[], itemProps: ObjectProperty[] } {
  const unitProps = [];
  const itemProps = [];

  for (const [id, row] of Object.entries(metaData.map)) {
    const type = row.string('type');
    const name = camelCase(weStrings.getProperty('WorldEditStrings', row.string('displayName')));
    let tsType = 'string';
    let tsFunction = 'string';

    if (type !== 'string') {
      if (type === 'int' || type === 'unreal' || type === 'real') {
        tsType = 'number';
        tsFunction = 'number';
      } else if (type === 'bool') {
        tsType = 'boolean';
        tsFunction = 'boolean';
      } else {
        console.warn(`Unhandled type: ${type} for ${name}`);
      }
    }

    const getter = `get ${name}(): ${tsType} { return this.${tsFunction}('${id}'); }`;
    const setter = `set ${name}(value: ${tsType} | undefined) { this.set('${id}', value); }`;

    if (id[0] === 'u') {
      unitProps.push({ name, tsType, getter, setter });
    } else {
      itemProps.push({ name, tsType, getter, setter });
    }
  }

  return { unitProps, itemProps };
}

function generateFetchType(props: ObjectProperty[]): string {
  return `export type FetchType = {\n${props.map((prop) => `  ${prop.name}: ${prop.tsType}`).join(',\n')}\n};`;
}

function generateFetch(props: ObjectProperty[]): string {
  return `fetch(): FetchType { return { ${props.map((prop) => `${prop.name}: this.${prop.name}`).join(', ')} }; }`;
}

export async function objectDataDefinitionsGenerator(weStrings: MappedData, unitAndItemMetaData: MappedData, unitStrings: MappedData, itemStrings: MappedData): Promise<void> {
  const { unitProps, itemProps } = generateObjectFunctions(weStrings, unitAndItemMetaData);
  const unitEnums = generateObjectsEnum(unitStrings);
  const itemEnums = generateObjectsEnum(itemStrings);

  console.groupCollapsed('Unit Functions');
  console.log(generateFetchType(unitProps));
  console.log(unitProps.map((prop) => [prop.getter, prop.setter, '']).flat().join('\n'));
  console.log(generateFetch(unitProps));
  console.groupEnd();

  console.groupCollapsed('Item Functions');
  console.log(generateFetchType(itemProps));
  console.log(itemProps.map((prop) => [prop.getter, prop.setter, '']).flat().join('\n'));
  console.log(generateFetch(itemProps));
  console.groupEnd();

  console.groupCollapsed('Units Enum');
  console.log(`export enum Units {\n${unitEnums.join('\n')}\n}\n`);
  console.groupEnd();
  
  console.groupCollapsed('Items Enum');
  console.log(`export enum Items {\n${itemEnums.join('\n')}\n}\n`);
  console.groupEnd();
}
