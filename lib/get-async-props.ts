import { BuilderContent, BuilderElement } from '@builder.io/sdk';
import traverse, { map } from 'traverse';
type PropsMappers = { [key: string]: (props: any) => Promise<any> };

export async function getAsyncProps(content: BuilderContent, mappers: PropsMappers) {
  const promises: Promise<any>[] = [];
  const resolvedContent = traverse(content).map(function(field) {
        if (field && typeof field === 'object' && !Array.isArray(field)) {
          const keys = Object.keys(field);
          keys.forEach((key) => {
            const mapper = mappers[key];
            if (mapper) {
              promises.push(
                mapper(field).then(result => {
                  this.update({
                    ...field,
                    ...result,
                  })
                })
              ); 
            }   
          })
        }
    });
  await Promise.all(promises);
  return resolvedContent;
}