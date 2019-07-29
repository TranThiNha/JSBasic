import MomentContainer from "../containers/Moment";
import Newspaper from "../containers/Newspapper";
import Home from "../containers/Home";

export const routes = {
    home: {
        path: '/',
        component: Home,
        exact: true
    },
    moment: {
        path: '/moment/:type',
        component: MomentContainer,
    },
    newspaper: {
        path: '/newspaper',
        component: Newspaper,
    }
}
