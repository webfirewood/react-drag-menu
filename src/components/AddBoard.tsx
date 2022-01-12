import styled from "styled-components";
import React, {useState} from "react";
import {ITodo, toDoState} from "../atoms";
import {useForm} from "react-hook-form";
import {useRecoilState} from "recoil";

const Wrapper = styled.div`
  margin-top: 20px;
  background-color: whitesmoke;
  justify-content: center;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }

`;
interface IForm {
    toDo: string;
}
interface IBoardProps {
    boardId: string;
}

function AddBoard() {
    const {register, setValue, handleSubmit} = useForm();
    const [toDos, setToDos] = useRecoilState(toDoState);

    const onSubmit = ({toDo}:IForm) => {
        console.log(toDo)
        setToDos(allBoards => {

            const copyBoard = [...allBoards];
            const check = copyBoard.filter(item => item.boardId === toDo);
            if(check.length === 0) {
                copyBoard.push({id:Date.now() ,boardId: toDo, toDos: []});
                localStorage.setItem('toDos', JSON.stringify([...copyBoard]))
            }
            return [...copyBoard];

        })
        setValue("toDo", "");
    };
    return (
        <Wrapper>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" {...register("toDo", {required: true})} placeholder="add board"/>
            </Form>
        </Wrapper>
    )
}

export default AddBoard;