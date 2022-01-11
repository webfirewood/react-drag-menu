import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import styled from "styled-components";
import {useRecoilState} from "recoil";
import {ITodo, toDoState} from "./atoms";
import Board from "./components/Board";
import Delete from "./components/Delete";
import AddBoard from "./components/AddBoard";
import produce from "immer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 680px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

const Boards = styled.div`
  display: grid;
  justify-content: center;
  width: 100%;
  gap: 10px;
  margin-top: 60px;
  grid-template-columns: repeat(3, 1fr);
`;


function App() {
    const [toDos, setToDos] = useRecoilState(toDoState);
    const onDragEnd = (info: DropResult) => {
        console.log(info)
        const {destination, draggableId, source} = info;
        if(!destination) return;
        if(destination?.droppableId === source.droppableId){
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
    return <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
            <AddBoard />
            <Boards>
                {toDos.map(item => <Board toDos={item.toDos} boardId={item.boardId} key={item.boardId}/>)}
            </Boards>
            <Delete />
        </Wrapper>
    </DragDropContext>
}
export default App;
