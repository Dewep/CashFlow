export function loadDBAsync(key: string, default_value: any): Promise<any> {
    return new Promise((resolve, reject) => {
        var item = localStorage.getItem(key);
        if (typeof item === "string") {
            resolve(JSON.parse(item));
        } else {
            resolve(default_value);
        }
    });
};

export function saveDBAsync(key: string, content: any): Promise<any> {
    return new Promise((resolve, reject) => {
        var content_json = JSON.stringify(content);
        localStorage.setItem(key, content_json);
        resolve(null);
    });
};

export function removeDBAsync(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        localStorage.removeItem(key);
        resolve(null);
    });
};
