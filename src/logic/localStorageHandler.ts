export const localStorageHandler: any = {
    write(key: string, value: string):void{
        localStorage.setItem(key, JSON.stringify(value));

    },
    read(key:string):string{
        return JSON.parse(localStorage.getItem(key) || "{}");
    }
}