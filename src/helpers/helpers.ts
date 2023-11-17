export const schedule = (something:()=>void, xx:number): Promise<void> => {
    return new Promise(resolve => setTimeout(something,xx))
}

export const responseStatusHandler = (status:number) => {

}