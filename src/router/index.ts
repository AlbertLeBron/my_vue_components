import VueRouter from 'vue-router';
import DropdownPage from '../pages/DropdownPage.vue';
import PopupMenuPage from '../pages/PopupMenuPage.vue';
import RangePage from '../pages/RangePage.vue';
import DotLinePage from '../pages/DotLinePage.vue';
import SelectionBoxPage from '../pages/SelectionBoxPage.vue';



export default new VueRouter({
    routes: [
            {
                path: '/', 
                redirect: 'dropdown'
            },{
                path: '/dropdown',
                component: DropdownPage
            },{
                path: '/popupmenu',
                component: PopupMenuPage
            },{
                path: '/range',
                component: RangePage
            },{
                path: '/dotLine',
                component: DotLinePage
            },{
                path: '/transfer',
                component: SelectionBoxPage
            }
        ]
});