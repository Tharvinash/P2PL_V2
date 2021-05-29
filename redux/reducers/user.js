import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_COMMENT_STATE_CHANGE} from "../constants"
// USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, CLEAR_DATA 

const initialState = {
    currentUser: null,
    posts: [],
    comment:[]
   // following: [],
}

export const user = (state = initialState, action) => {

   
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }

        case USER_COMMENT_STATE_CHANGE:
            return {
                ...state,
                comment: action.comment
            }
    //     case CLEAR_DATA:
    //         return initialState
        default:
            return state;
    }
}