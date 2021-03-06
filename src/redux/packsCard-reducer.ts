import {Dispatch} from "redux";
import {cardsAPI} from "../components/api/cards-api";
import {AppRootReducerType} from "./store";
import {ThunkAction} from "redux-thunk";

export type CardsType = {
    answer: string
    question: string
    cardsPack_id: string
    grade: number
    shots: number
    user_id: string
    created: string
    updated: string
    _id: string
}

export type initialPacksCardStateType = {
    cards: CardsType[],
    cardsTotalCount: number
    maxGrade: number
    minGrade: number
    packUserId: string
    page: number
    pageCount: number

    getCards: {
        cardAnswer: string,
        cardQuestion: string,
        cardsPack_id: string,
        min: number,
        max: number,
        sortCard: string,
        page: number,
        pageCount: number,
    }
}

const initialPacksCardState: initialPacksCardStateType = {
    cards: [
        {
            answer: "",
            question: "",
            cardsPack_id: "",
            grade: 0,
            shots: 0,
            user_id: "",
            created: "",
            updated: "",
            _id: "",
        },
        {
            answer: "J.Cole",
            question: "",
            cardsPack_id: "",
            grade: 0,
            shots: 0,
            user_id: "",
            created: "2020-05-13T11:05:44.867Z",
            updated: "2020-05-13",
            _id: "5ebbd48876810f1ad0e7ece3",
        },
    ],
    cardsTotalCount: 7,
    maxGrade: 4.987525071790364,
    minGrade: 2.0100984354076568,
    page: 1,
    pageCount: 5,
    packUserId: "",

    getCards: {
        cardAnswer: "",
        cardQuestion: "",
        cardsPack_id: "",
        min: 1,
        max: 9,
        sortCard: "0grade",
        page: 1,
        pageCount: 7,
    }
}


export const packsCardReducer = (state = initialPacksCardState, action: ActionType): initialPacksCardStateType => {
    switch (action.type) {
        case "CARDS/GET-CARDS" :
            return {
                ...state, cards: action.cards
            }
        case "CARDS/CHANGE-CARDS-SIZE-PAGE" :
            return {
                ...state, pageCount: action.pageSize
            }
        case "CARDS/CHANGE-CARDS-CURRENT-PAGE":
            return {...state, page: action.pageNumber}
        default:
            return state
    }
}

export type PacksCardReducerACType = ReturnType<typeof packsCardReducerAC>
export const packsCardReducerAC = (cards: CardsType[]) => {
    return {
        type: "CARDS/GET-CARDS",
        cards
    } as const
}

export type ChangeCardsSizePageACType = ReturnType<typeof changeCardsSizePageAC>
export const changeCardsSizePageAC = (pageSize: number) => {
    return {
        type: "CARDS/CHANGE-CARDS-SIZE-PAGE",
        pageSize
    } as const
}
export type CurrentCardPageChangeACType = ReturnType<typeof currentCardPageChangeAC>
export const currentCardPageChangeAC = (pageNumber: number) => {
    return {
        type: "CARDS/CHANGE-CARDS-CURRENT-PAGE",
        pageNumber
    } as const
}
///
export type ActionType = PacksCardReducerACType
    | ChangeCardsSizePageACType
    | CurrentCardPageChangeACType
export type ThunkType = ThunkAction<void, AppRootReducerType, unknown, ActionType>

export const packsCardTC = (id: string | undefined, pageNumber: number, pageCount: number): ThunkType => {
    return (dispatch: Dispatch<ActionType>) => {

        let params = {id: id, pageNumber: pageNumber, pageCount: pageCount}
        cardsAPI.getCards(params).then((res) => {
            dispatch(packsCardReducerAC(res.data.cards))
        }).catch((err) => {

        })
    }
}




export const getCards = (id: string) => async (dispatch: Dispatch, getState: () => AppRootReducerType) => {

    const { token } = getState().login

    const res = await cardsAPI.getCard(id, token)
    dispatch(packsCardReducerAC(res.data.cards))
}


export const gradeCards = (grade: number, cardId: string) => async (dispatch: Dispatch) => {

    const res = await cardsAPI.gradeCards( grade, cardId )
    //dispatch(packsCardReducerAC(res.data.cards))

}


