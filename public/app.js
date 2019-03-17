const routes = [
	{ path: '/', redirect: '/start' },
	{ path: '/book', component: Vue.component('route-book') },
	{ path: '/confirm/:circuitID/:trackdayDate/:circuitName', component: Vue.component('route-confirm') },
	{ path: '/admin', component: Vue.component('route-admin') },
	{ path: '/login', component: Vue.component('route-login') },
	{ path: '/profile', component: Vue.component('route-profile') },
	{ path: '/start', component: Vue.component('route-start') },
	{ path: '/trackinfo', component: Vue.component('route-trackinfo') },
];

// Create VueRouter
// Docs: https://router.vuejs.org/guide
const router = new VueRouter({
	routes
});

// Create VueApp
// Docs: https://vuejs.org/v2/guide
const app = new Vue({
	// el: '#app' // can't use element property with VueRouter
	router,
	data: {
		isAdmin: false
	},
	methods: {
		redirect(target) {
			// Used in the navigation
			this.$router.push(target);
		}
	}
}).$mount('#app');
