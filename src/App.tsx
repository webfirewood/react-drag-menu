import {DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle} from "react-beautiful-dnd";
import styled from "styled-components";
import {useRecoilState} from "recoil";
import {ITodo, IToDosState, toDoState} from "./atoms";
import Board from "./components/Board";
import Delete from "./components/Delete";
import AddBoard from "./components/AddBoard";
import produce from "immer";
import {AiFillDelete} from "react-icons/ai";
import React from "react";
import {useForm} from "react-hook-form";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 680px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

const BoxWrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  margin: 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ExWrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: black;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  min-height: 50vh;
  overflow: hidden;
`;

const Boards = styled.div`
  display: grid;
  justify-content: center;
  width: 100%;
  gap: 10px;
  margin-top: 60px;
  grid-template-columns: repeat(3, 1fr);
`;

const Title = styled.h2`
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Form = styled.form`
  width: 100%;

  input {
    width: 100%;
  }
`;

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver: any) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 200
});

interface IForm {
    toDo: string;
}

function App() {
    const {register, setValue, handleSubmit} = useForm<IForm>();
    const [toDos, setToDos] = useRecoilState(toDoState);
    const onDragEnd = (info: DropResult) => {
        console.log(info)
        const {destination, draggableId, source} = info;
        if(!destination) return;
        if(info.type === 'droppable'){
            setToDos(allBoards => {
                const boardCopy = [...allBoards];
                const taskObj = boardCopy[source.index];
                boardCopy.splice(source.index, 1);
                boardCopy.splice(destination.index, 0, taskObj);
                if(localStorage.getItem('toDos') !== null){
                    localStorage.setItem('toDos', JSON.stringify([...boardCopy]))
                }
                return [...boardCopy]
            })

        } else if(destination?.droppableId === source.droppableId){
            setToDos(allBoards => {
                const boardCopy = produce(allBoards, draft => {
                    draft.filter(item => {
                        if(item.boardId === source.droppableId){
                            const taskObj = item.toDos[source.index];
                            item.toDos.splice(source.index, 1);
                            item.toDos.splice(destination?.index, 0,  taskObj);
                        }
                    })
                });
                if(localStorage.getItem('toDos') !== null){
                    localStorage.setItem('toDos', JSON.stringify([...boardCopy]))
                }

                return [...boardCopy]
            })
        } else if (destination.droppableId === 'del'){
            setToDos(allBoards => {
                const boardCopy = produce(allBoards, draft => {
                    draft.filter(item => {
                        if(item.boardId === source.droppableId){
                            item.toDos.splice(source.index, 1);
                        }
                    })
                });

                if(localStorage.getItem('toDos') !== null){
                            localStorage.setItem('toDos', JSON.stringify([...boardCopy]))
                        }

                return [...boardCopy];
            })
        } else {
            setToDos((allBoards) => {

                let taskObj:ITodo;
                const boardCopy = produce(allBoards, draft => {
                   draft.filter(item => {
                       if(item.boardId === source.droppableId){
                           taskObj = item.toDos[source.index];
                           item.toDos.splice(source.index, 1);
                       }
                    })
                    draft.filter(item => {
                        if(item.boardId === destination.droppableId){
                            item.toDos.splice(destination?.index, 0, taskObj);
                        }
                    })
                });
                    if(localStorage.getItem('toDos') !== null){
                        localStorage.setItem('toDos', JSON.stringify([...boardCopy]))
                    }
                return [...boardCopy]
            })

        }
    }

    const onClick = (boardId:string) => {
        setToDos(allBoards => {
            const result = [...allBoards]
            const idx = result.findIndex(item => item.boardId === boardId);
            result.splice(idx, 1);
            localStorage.setItem('toDos', JSON.stringify([...result]));
            return [...result]
        })

    }

    return <DragDropContext onDragEnd={onDragEnd}>
        <AddBoard />
                <Droppable droppableId="droppable" type="droppable">
                    {(provided, snapshot) => (
                        <Wrapper
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {toDos.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.boardId} index={index}>
                                {(provided, snapshot) => (
                                    <div>
                                        <div
                                            ref={provided.innerRef}
                                             {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}

                                        >
                                            <Title>{item.boardId}<AiFillDelete onClick={() => {onClick(item.boardId)}}>삭제</AiFillDelete></Title>

                                                <Board toDos={item.toDos} boardId={item.boardId}/>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                            ))}
                            {provided.placeholder}
                        </Wrapper>
                        )}
                </Droppable>
        <Delete />
    </DragDropContext>
}
export default App;
