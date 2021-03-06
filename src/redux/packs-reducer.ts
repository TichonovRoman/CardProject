import {Dispatch} from "redux";
import {addPackDataType, cardsAPI, myPackNameEditDataType} from "../components/api/cards-api";
import {ThunkAction} from "redux-thunk";
import {AppRootReducerType} from "./store";

//Types

export type cardPackType = {
    _id: string,
    user_id: string,
    name: string,
    cardsCount: number,
    created: string,
    updated: string,
}
export type GetParamsType = {
    packName: string, // не обязательно
    min: number, // не обязательно
    max: number, // не обязательно
    sortPacks: string, //"0updated" // не обязательно
    page: number, // не обязательно
    pageCount: number, // не обязательно
    user_id: string,  // чьи колоды не обязательно, или прийдут все
}
export type PacksStateType = {
    isDisabledSearchButton: boolean,
    isDisabledAddNewPackButton: boolean,

    cardPacks: cardPackType[]
    cardPacksTotalCount: number
    // количество колод
    maxCardsCount: number
    minCardsCount: number
    page: number // выбранная страница
    pageCount: number
    // количество элементов на странице

    getParams: GetParamsType

    circularProgress: boolean
    // error: string,
}
export type setPacksDataType = {
    cardPacks: cardPackType[]
    cardPacksTotalCount: number
    // количество колод
    maxCardsCount: number
    minCardsCount: number
    page: number // выбранная страница
    pageCount: number
}
export type showMyAllPacksACType = {
    type: "PACKS-LIST/SHOW-MY-ALL-PACKS",
    value: string
}
export type editNumberOfCardsACType = {
    type: "PACKS-LIST/EDIT-NUMBER-OF-CARDS",
    payload: {
        min: number,
        max: number,
    }
}
export type setPacksACType = {
    type: "PACKS-LIST/SET-PACKS",
    payload: setPacksDataType
}
export type switchingProgressACType = {
    type: "PACKS-LIST/SWITCH-PROGRESS",
    payload: {
        circularProgress: boolean
    }
}
export type editSearchNameACType = {

    type: "PACKS-LIST/EDIT-SEARCH-VALUE",
    value: string,

}
export type filterTableValue = "0updated" | "1updated"
    | "0created" | "1created"
    | "0cardsCount" | "1cardsCount"
    | "0name" | "1name"
export type filterTableACType = {
    type: "PACKS-LIST/FILTER-TABLE",
    filterValue: filterTableValue
}
export type currentPageChangeACType = {
    type: "PACKS-LIST/CHANGE-CURRENT-PAGE",
    pageNumber: number
}
export type sizePageChangeACType = {
    type: "PACKS-LIST/CHANGE-SIZE-PAGE",
    pageSize: number
}

type ActionsType = setPacksACType
    | editSearchNameACType
    | showMyAllPacksACType
    | filterTableACType
    | currentPageChangeACType
    | sizePageChangeACType
    | editNumberOfCardsACType
    | switchingProgressACType

//State:

const initialPacksState: PacksStateType = {
    isDisabledSearchButton: false,
    isDisabledAddNewPackButton: false,

    cardPacks: [],
    cardPacksTotalCount: 14,
    maxCardsCount: 4,
    minCardsCount: 0,
    page: 1,
    pageCount: 5,

    getParams: {
        packName: "", // не обязательно
        min: 0, // двойной ползунок, не обязательно
        max: 9, // двойной ползунок, не обязательно
        sortPacks: "0updated", // не обязательно
        page: 1, // не обязательно
        pageCount: 5, // не обязательно
        user_id: "",  // чьи колоды не обязательно, или прийдут все
    },

    circularProgress: false,

    // error: string,
}

//Reducer:

export const packsReducer = (state = initialPacksState, action: ActionsType): PacksStateType => {

    switch (action.type) {
        case "PACKS-LIST/SET-PACKS":
            return {...state, ...action.payload, cardPacks: action.payload.cardPacks}
        case "PACKS-LIST/EDIT-SEARCH-VALUE":
            return {...state, getParams: {...state.getParams, packName: action.value}}
        case "PACKS-LIST/SHOW-MY-ALL-PACKS":
            return {...state, getParams: {...state.getParams, user_id: action.value}}
        case "PACKS-LIST/FILTER-TABLE":
            return {...state, getParams: {...state.getParams, sortPacks: action.filterValue}}
        case "PACKS-LIST/CHANGE-CURRENT-PAGE":
            return {...state, getParams: {...state.getParams, page: action.pageNumber}}
        case "PACKS-LIST/CHANGE-SIZE-PAGE":
            return {...state, getParams: {...state.getParams, pageCount: action.pageSize}}
        case "PACKS-LIST/EDIT-NUMBER-OF-CARDS":
            return {...state, getParams: {...state.getParams, ...action.payload}}
        case "PACKS-LIST/SWITCH-PROGRESS":
            return {...state, ...action.payload}

        default:
            return state;
    }
}

//Action and Action Creators:

export const showMyAllPacksAC = (value: string): showMyAllPacksACType => {
    return {
        type: "PACKS-LIST/SHOW-MY-ALL-PACKS",
        value
    }
}
export const switchingProgressAC = (circularProgress: boolean): switchingProgressACType => {
    return {
        type: "PACKS-LIST/SWITCH-PROGRESS",
        payload: {
            circularProgress
        }
    }
}
export const editNumberOfCardsAC = (min: number, max: number): editNumberOfCardsACType => {
    return {
        type: "PACKS-LIST/EDIT-NUMBER-OF-CARDS",
        payload: {
            min,
            max
        }
    }
}
export const setPacksAC = (data: setPacksDataType): setPacksACType => {
    return {
        type: "PACKS-LIST/SET-PACKS",
        payload: data
    }
}
export const editSearchNameAC = (value: string): editSearchNameACType => {
    return {
        type: "PACKS-LIST/EDIT-SEARCH-VALUE",
        value
    }
}
export const filterTableAC = (filterValue: filterTableValue): filterTableACType => {
    return {
        type: "PACKS-LIST/FILTER-TABLE",
        filterValue
    }
}
export const currentPageChangeAC = (pageNumber: number): currentPageChangeACType => {
    return {
        type: "PACKS-LIST/CHANGE-CURRENT-PAGE",
        pageNumber
    }
}
export const sizePageChangeAC = (pageSize: number): sizePageChangeACType => {
    return {
        type: "PACKS-LIST/CHANGE-SIZE-PAGE",
        pageSize
    }
}

//Thunk:

type ThunkType = ThunkAction<void, AppRootReducerType, unknown, ActionsType>

export const getPacksTC = (): ThunkType => {

    return (dispatch: Dispatch<ActionsType>, getState) => {
        dispatch(switchingProgressAC(true))
        let params = getState().packs.getParams

        cardsAPI.getPacks(params)
            .then((res) => {
                dispatch(setPacksAC(res.data))
            })
            .catch((err) => {
                // dispatch(errorMessageAC("some error"))
            })
            .finally(() => {
                dispatch(switchingProgressAC(false))
            })
    }
}

export const addNewPackTC = (params: addPackDataType): ThunkType => {

    return (dispatch: Dispatch<any>) => {
        dispatch(switchingProgressAC(true))
        cardsAPI.addNewPack(params)
            .then((res) => {
                dispatch(getPacksTC())
            })
            .catch((err) => {
                // dispatch(errorMessageAC("some error"))
            })
            .finally(() => {
                //выключаем крутилку
            })
    }
}

export const myPackNameEditTC = (params: myPackNameEditDataType): ThunkType => {

    return (dispatch: Dispatch<any>) => {
        dispatch(switchingProgressAC(true))
        cardsAPI.editNamePack(params)
            .then((res) => {
                dispatch(getPacksTC())
            })
            .catch((err) => {
                // dispatch(errorMessageAC("some error"))
            })
            .finally(() => {
                //выключаем крутилку
            })
    }
}

export const deletePackTC = (id: string): ThunkType => {

    return (dispatch: Dispatch<any>) => {
        dispatch(switchingProgressAC(true))
        cardsAPI.deletePack(id)
            .then((res) => {

                dispatch(getPacksTC())
            })
            .catch((err) => {
                // dispatch(errorMessageAC("some error"))
            })
            .finally(() => {

            })
    }
}


