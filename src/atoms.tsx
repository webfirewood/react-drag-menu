import {atom, selector} from "recoil";

export interface ITodo {
    id: number;
    text: string;
}

export interface IToDosState {
    //[key:string]: ITodo[];
    id:number;
    boardId: string;
    toDos: ITodo[];
}

const localData = localStorage.getItem('toDos');


export const toDoState = atom<IToDosState[]>({
    key:"toDo",
    default: localData === null ? [] : JSON.parse(localData)
});
