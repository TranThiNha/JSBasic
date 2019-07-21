import MomentContainer from "../containers/Moment";

export const routes = {
    home: {
        path: '/',
    },
    moment: {
        path: '/moment/:type',
        component: MomentContainer
    },
}