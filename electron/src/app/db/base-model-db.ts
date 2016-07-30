export abstract class BaseModelDB {
    id: number;

    fromObject(obj) {
        for (var propName in obj) {
            this[propName] = obj[propName];
        }
        return this;
    }
}
