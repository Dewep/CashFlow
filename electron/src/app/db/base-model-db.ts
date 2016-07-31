export abstract class BaseModelDB {
    id: number;

    fromStandardObject(obj): Promise<BaseModelDB> {
        return new Promise((resolve, reject) => {
            for (var propName in obj) {
                this[propName] = obj[propName];
            }
            resolve(this);
        });
    }

    toStandardObject() {
        var obj = {};
        for (var propName in this) {
            obj[propName] = this[propName];
        }
        return obj;
    }
}
