import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DraggableCard";
import {useForm} from "react-hook-form";
import {ITodo, toDoState} from "../atoms";
import {useRecoilState, useSetRecoilState} from "recoil";
import {AiFillDelete} from "react-icons/ai";
import React from "react";
import produce from "immer";
import Delete from "./Delete";




interface IAreaProps {
    isDraggingFromThis: boolean;
    isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
          props.isDraggingOver
                  ? "#dfe6e9"
                  : props.isDraggingFromThis
                          ? "#b2bec3"
                          : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }

`;

interface IBoardProps {
    toDos: ITodo[];
    boardId: string;
}

interface IForm {
    toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
    const setToDos = useSetRecoilState(toDoState);
    const [allToDos, setAllToDos] = useRecoilState(toDoState);
    const {register, setValue, handleSubmit} = useForm<IForm>();
    const onClick = () => {
        setAllToDos(allBoards => {
            const result = [...allBoards]
            const idx = result.findIndex(item => item.boardId === boardId);
            result.splice(idx, 1);
            localStorage.setItem('toDos', JSON.stringify([...result]));
            return [...result]
        })

    }
    const onValid = ({toDo}:IForm) => {
        const newToDo = {
            id:Date.now(),
            text: toDo,
        };

        setToDos(allBoards => {
            const copyBoard = produce(allBoards, draft => {
                draft.filter(item => {
                    if(item.boardId === boardId){
                        item.toDos.push(newToDo);
                    }
                })
            })
            localStorage.setItem('toDos', JSON.stringify([...copyBoard]));
            return [
                ...copyBoard,

            ]
        });

        setValue("toDo", "");
    }
    return (
        <div>
            <Form onSubmit={handleSubmit(onValid)}>
                <input
                    {...register("toDo", {required: true})}
                    type="text"
                    placeholder={`Add to task on ${boardId}`}
                />
            </Form>
            <Droppable droppableId={boardId} type="board">
                {(magic, info) => (
                    <Area
                        isDraggingOver={info.isDraggingOver}
                        isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                        ref={magic.innerRef}
                        {...magic.droppableProps}
                    >
                        {toDos.length > 0 ? toDos.map((toDo, index) => (
                            <DragabbleCard key={toDo.id} idx={index} toDoId={toDo.id} toDoText={toDo.text} />
                        )) : []}
                        {magic.placeholder}
                    </Area>

                )}
            </Droppable>
        </div>

    );
}
export default Board;
