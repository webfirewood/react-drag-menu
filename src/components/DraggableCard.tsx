import React from "react";
import {Draggable} from "react-beautiful-dnd";
import styled from "styled-components";


const Card = styled.div<ICardProps>`
  border-radius: 5px;
  padding: 5px 5px;
  margin-bottom: 5px;
  background-color: ${(props) => props.isDragging ? 'tomato' : props.theme.cardColor};
`;

interface IDraggableCardProps {
    toDoId: number;
    toDoText: string;
    idx: number;
}

interface ICardProps {
    isDragging: boolean;
}

function DraggableCard({toDoId, toDoText, idx} : IDraggableCardProps) {
    return <Draggable key={toDoId} draggableId={toDoId + ""} index={idx}>
        {(magic, snapShot) =>
            <Card
                isDragging={snapShot.isDragging}
                ref={magic.innerRef}
                {...magic.draggableProps}
                {...magic.dragHandleProps}>{toDoText}
            </Card>}
    </Draggable>
}

export default React.memo(DraggableCard);


