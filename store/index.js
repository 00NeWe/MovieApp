// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		cinemaMovies: [],
		currentSelected: {
			date: '',
			shows: [],
			movieId: '',
			cinemaId: '',
			plist: []
		},
		orders: []
	},
	mutations: {

		setOrders(state, orders) {
			state.orders = orders; // 设置订单列表
		},
		setMovies(state, movies) {
			state.cinemaMovies = movies;
		},
		setCurrentSelected(state, payload) {
			state.currentSelected = {
				...state.currentSelected,
				...payload
			};
		},
		setCurrentSelectedShows(state, shows) {
			state.currentSelected.shows = shows;
		},
		setCurrentSelectedPlist(state, plist) {
			state.currentSelected.plist = plist;
		}
	},
	actions: {
		fetchOrders({
			commit
		}) {
			// 模拟获取订单数据
			const orders = [{
					id: 1,
					image: 'https://example.com/image1.jpg',
					title: '订单1',
					time: '2024-09-27 10:00',
					price: 100,
					location: '地点1'
				},
				{
					id: 2,
					image: 'https://example.com/image2.jpg',
					title: '订单2',
					time: '2024-09-27 11:00',
					price: 150,
					location: '地点2'
				}
				// 可以继续添加其他订单
			];
			commit('setOrders', orders);
		},
		fetchMovies({
			commit,
			dispatch
		}, cinemaId) {
			uni.request({
				url: `https://apis.netstart.cn/maoyan/cinema/shows?cinemaId=${cinemaId}&ci=421`,
				method: 'GET',
				success: (res) => {
					if (res.data && res.data.data && res.data.data.movies) {
						commit('setMovies', res.data.data.movies);
						// 在成功获取电影数据后更新场次
						dispatch('updateSelectedShows');
					} else {
						console.error('请求热映电影列表失败', res.data.errMsg);
					}
				},
				fail: (err) => {
					console.error('请求热映电影列表失败', err);
				}
			});
		},

		updateSelectedShows({
			commit,
			state
		}) {
			console.log("updateSelectedShows被执行");
			console.log("state.cinemaMovies", state.cinemaMovies); // 检查影院电影数据是否存在
			if (state.cinemaMovies && state.currentSelected.movieId) {
				console.log("state.currentSelected.movieId", state.currentSelected.movieId);
				console.log("state.currentSelected.date", state.currentSelected.date);
				const currentDate = state.currentSelected.date;
				const movie = state.cinemaMovies.find(movie => movie.id === state.currentSelected.movieId);
				console.log("找到的 movie:", movie); // 检查找到的电影数据
				if (movie) {
					console.log("zhixingmei1");
					const matchedShow = movie.shows.find(show => show.showDate === currentDate);
					console.log("找到的 matchedShow:", matchedShow); // 检查找到的 show 数据
					if (matchedShow) {
						commit('setCurrentSelectedShows', matchedShow.plist);
						console.log("matchedShow.plist已变更:", matchedShow.plist);
					} else {
						commit('setCurrentSelectedShows', []);
					}
				} else {
					console.log("没有找到匹配的电影");
				}
			} else {
				console.log("没有找到电影或 movieId 未设置");
			}
		},
		selectShow({
			commit
		}, show) {
			commit('setCurrentSelectedPlist', show);
		},
		setCurrentSelected({
			commit
		}, payload) {
			// 可以在这里处理一些异步请求或其他逻辑
			console.log('Action 触发，payload:', payload);
			commit('setCurrentSelected', payload); // 提交 mutation，传递 payload
		}
	},
	getters: {
		getOrders(state) {
			return state.orders; // 获取订单列表
		}
	}
});