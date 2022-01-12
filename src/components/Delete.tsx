import styled from "styled-components";
import {Droppable} from "react-beautiful-dnd";
import { AiFillDelete } from "react-icons/ai";

const Wrapper = styled.div`
  margin-top: 20px;
  background-color: whitesmoke;
  justify-content: center;
`;

const Area = styled.div`
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

interface IBoardProps {
    boardId: string;
}

function Delete() {
    return (
        <Wrapper>
            <Droppable droppableId="del" type="board">
                {(magic) => (
                    <Area ref={magic.innerRef} {...magic.droppableProps}><AiFillDelete size="24" />
                        {magic.placeholder}
                    </Area>
                )}
            </Droppable>
        </Wrapper>
    )
}

export default Delete;