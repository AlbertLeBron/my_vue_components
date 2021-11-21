import VueRouter from 'vue-router';
import DropdownPage from '../pages/DropdownPage.vue';
import ComboPage from '../pages/ComboPage.vue';
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
                path: '/combo',
                component: ComboPage
            },{
                path: '/range',
                component: RangePage
            },{
                path: '/dotLine',
                component: DotLinePage
            },{
                path: '/selectionbox',
                component: SelectionBoxPage
            }
        ]
});