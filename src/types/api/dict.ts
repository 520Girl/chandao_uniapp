export interface reqStatus {
    types: string[] | null;
}


export interface resItem {
    id: number;
    typid: number;
    name: string;
    value: number;
    orderNum: number;
    parentId: number | null;
    type:number | null
}