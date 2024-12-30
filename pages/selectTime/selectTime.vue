<template>
	<view>
		<!-- 导航栏 -->
		<view class="navbar">
			<uni-nav-bar :fixed="true" background-color="white" :border="false" status-bar left-icon="left"
				@clickLeft="back">
				<view class="nav-container">
					<text class="navbar-title">{{ cinema.name }}</text>
				</view>
			</uni-nav-bar>
		</view>
		<!-- 影院详情 -->
		<view class="cinema-info">
			<view class="cinema-info-left">
				<text class="cinema-name">{{ cinema.name }}</text>
				<text class="cinema-address">{{ cinema.addr }}</text>
			</view>
			<view class="cinema-actions">
				<view class="custom-button" @click="openMap">
					<uni-icons type="location" size="30" color="#1E90FF"></uni-icons>
					<text style="font-size: 14px;">地图</text>
				</view>
				<view class="vertical-line"></view>
				<view class="custom-button" @click="addFavorite">
					<uni-icons type="star" size="30" color="orange"></uni-icons>
					<text style="font-size: 14px;">收藏</text>
				</view>
			</view>
		</view>
		<!-- 影片滑动 -->
		<view class="movie-swiper">
			<!-- 轮播区域 -->
			<view class="movie-swiper-img">
				<uni-icons class="left-arrow" type="left" size="30" color="#333" style="margin-top: 70px;"
					@click="prev"></uni-icons>
				<swiper :current="currentIndex" @change="onChange" class="swiper">
					<swiper-item v-for="(movie, index) in movies" :key="index">
						<image :src="movie.img" class="movie-image"></image>
					</swiper-item>
				</swiper>
				<uni-icons class="right-arrow" type="arrowright" size="30" color="#333" style="margin-top: 70px;"
					@click="next"></uni-icons>
			</view>

			<!-- 电影简介 -->
			<view class="movie-info" v-if="currentMovie">
				<text class="movie-title">{{ currentMovie.nm }}</text>
				<text class="movie-score">评分: {{ currentMovie.sc }}</text>
				<text class="movie-desc">{{ currentMovie.desc }}</text>
			</view>

			<!-- 日期选择 -->
			<scroll-view class="date-selector" scroll-x="true">
				<view v-for="(date, index) in movieDates" :key="index" class="date-item"
					:class="{ selected: selectedDate === date }" @click="selectDate(date)">
					<text>{{ date.split('-').slice(1).join('-') }}</text>
				</view>
			</scroll-view>

			<!-- 场次列表 -->
			<view class="show-list" v-if="selectedShows">
				<view v-for="(show, index) in selectedShows" :key="index" class="show-item"
					@click="goSelectSeat(show)">
					<view class="show-time">
						<text class="show-tm">{{ show.tm }} </text>
						<text class="show-stm">{{ getEndTime(show.tm, currentMovie.dur) }}散场</text>
					</view>
					<view class="show-info">
						<text class="show-lt">{{ show.lang }}{{ show.tp }}</text>
						<text class="show-th">{{ show.th }}</text>
					</view>
					<view class="show-price">
						<text>¥{{ show.vipPrice }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cinema: {
					name: '',
					addr: '',
				},
				cinemaId: '',
				movieId: '',
				movies: [],
				currentIndex: 0,
				selectedDate: '',

			}
		},
		onLoad: function(options) {
			// 获取传递的影院ID和电影ID参数
			this.cinemaId = options.cinemaId;
			this.movieId = options.movieId;
			// const defaultDate = this.movies[this.currentIndex].shows[0].showDate;
			// this.selectDate(defaultDate);
			this.fetchCinemaDetails();
			this.$store.dispatch('setCurrentSelected', {
				movieId: this.movieId,
				cinemaId: this.cinemaId
			});
			this.$store.dispatch('fetchMovies', this.cinemaId).then(() => {
				if (this.$store.state.cinemaMovies.length > 0) {
					this.movies = this.$store.state.cinemaMovies;
					this.currentIndex = this.$store.state.cinemaMovies.findIndex(movie => movie.id
						.toString() === this.movieId.toString());
				}
				console.log('找到的索引:', this.currentIndex);
			}).catch((error) => {
				console.error('请求电影数据失败:', error);
			});
		},


		computed: {
			// 获取当前展示的电影
			currentMovie() {
				return this.movies[this.currentIndex] || null;
			},
			// 获取某电影上映日期列表
			movieDates() {
				const dates = this.currentMovie ? this.currentMovie.shows.map(show => show.showDate) : [];
				this.selectedDate = dates[0];
				return dates;
			},
			selectedShows() {
				return this.$store.state.currentSelected.shows;
			}

		},
		methods: {
			back() {
				const pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack({
						delta: 1
					});
				} else {
					uni.reLaunch({
						url: '/pages/movieCinema/movieCinema'
					});
				}
			},
			openMap() {
				// 打开地图
				uni.openLocation({
					latitude: 23.545856,
					longitude: 113.264381,
					success() {
						console.log('地图打开成功');
					},
					fail(err) {
						console.error('地图打开失败', err);
					}
				});
			},
			addFavorite() {
				// 添加收藏
				uni.showToast({
					title: '收藏成功',
					icon: 'success',
					duration: 2000
				});
			},
			prev() {
				if (this.currentIndex > 0) {
					this.currentIndex -= 1;
				} else {
					this.currentIndex = this.movies.length - 1;
				}
				this.movieId = this.movies[this.currentIndex].id;
				this.$store.dispatch('setCurrentSelected', {
					movieId: this.movieId
				});
				const defaultDate = this.movies[this.currentIndex].shows[0].showDate;
				this.selectDate(defaultDate);
			},
			next() {
				if (this.currentIndex < this.movies.length - 1) {
					this.currentIndex += 1;
				} else {
					this.currentIndex = 0;
				}
				this.movieId = this.movies[this.currentIndex].id;
				this.$store.dispatch('setCurrentSelected', {
					movieId: this.movieId
				});
				const defaultDate = this.movies[this.currentIndex].shows[0].showDate;
				this.selectDate(defaultDate);
			},
			fetchCinemaDetails() {
				console.log("影院idddd", this.cinemaId);
				uni.request({
					url: `https://apis.netstart.cn/maoyan/cinema/detail?cinemaId=${this.cinemaId}`,
					method: 'GET',
					success: (res) => {
						if (res.data && res.data.data && res.data.data.nm) {
							const cinemaData = res.data.data;
							this.cinema.name = cinemaData.nm; // 影院名称
							this.cinema.addr = cinemaData.addr; // 影院地址
							console.log("影院名称:", this.cinema.name);
							console.log("影院地址:", this.cinema.addr);
						} else {
							console.error('未能获取影院详情', res.data.errMsg);
						}
					},
					fail: (err) => {
						console.error('请求影院详情失败:', err);
					}
				});
			},


			onChange(event) {
				this.currentIndex = event.detail.current;
				this.movieId = this.movies[this.currentIndex].id;
				this.$store.dispatch('setCurrentSelected', {
					movieId: this.movieId
				});
				const defaultDate = this.movies[this.currentIndex].shows[0].showDate;
				this.selectDate(defaultDate);


			},
			selectDate(date) {
				console.log("date",date);
				this.$store.dispatch('setCurrentSelected', {
					date: date
				});
				console.log("this.$store.state.currentSelected",this.$store.state.currentSelected.date);
				this.$store.dispatch('updateSelectedShows');
			},

			getEndTime(startTime, duration) {
				let [hours, minutes] = startTime.split(':').map(Number);
				let endTime = new Date();
				endTime.setHours(hours, minutes);
				endTime.setMinutes(minutes + duration);
				let endedHours = endTime.getHours().toString().padStart(2, '0');
				let endedMinutes = endTime.getMinutes().toString().padStart(2, '0');
				return `${endedHours}:${endedMinutes}`;

			},
			goSelectSeat(show) {
				this.$store.dispatch('selectShow', show);
				wx.navigateTo({
					url: `/pages/selectSeat/selectSeat`
				});
			}
		},

	}
</script>

<style>
	/* 导航栏 */
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60px;
	}

	.nav-container {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.navbar-title {
		color: black;
		font-size: 18px;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* 影院信息 */
	.cinema-info {
		background-color: #fff;
		padding-top: 180rpx;
		display: flex;
		margin-left: 30rpx;
		margin-right: 20rpx;
		border-bottom: 1px solid #ccc;
	}

	.cinema-info-left {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 70%;
		padding-right: 5%;
	}

	.cinema-name {
		font-size: 20px;
		color: #333;
		margin-bottom: 10px;
	}

	.cinema-address {
		font-size: 16px;
		color: #666;
		margin-bottom: 20px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}


	.cinema-actions {
		display: flex;
		justify-content: space-between;
		width: 25%;
		padding-bottom: 20rpx;
	}

	.cinema-actions .custom-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 5px;
		color: #333333;
		margin-left: 10rpx;
		margin-right: 10rpx;
	}

	.custom-button text {
		margin-top: 8px;
		margin-bottom: 5px;
	}

	.vertical-line {
		width: 1px;
		height: 30px;
		background-color: #ccc;
		margin-top: 40rpx;
	}

	/* 影片滑动 */
	.movie-swiper {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		background-color: #f5f5f5;
	}

	.movie-swiper-img {
		display: flex;
		justify-content: space-around;
		width: 100%;
		height: 175px;
	}

	.swiper {
		width: 50%;
		height: 175px;
		display: flex;
		justify-content: space-between;
	}

	.movie-image {
		width: 68%;
		height: 100%;
		object-fit: cover;
		border-radius: 8px;
		margin-left: 17%;
	}

	/* 电影信息样式 */
	.movie-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 15px;
		background-color: #ffffff;
		padding: 15px;
		border-radius: 10px;
		width: 90%;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.movie-title {
		font-size: 20px;
		font-weight: bold;
		color: #333;
		margin-bottom: 10px;
	}

	.movie-score {
		font-size: 18px;
		color: #ff9900;
		margin-bottom: 10px;
	}

	.movie-desc {
		font-size: 14px;
		color: #666;
	}

	/* 日期选择样式 */
	.date-selector {
		display: flex;
		justify-content: center;
		margin-top: 10px;
		overflow-x: auto;
		white-space: nowrap;
		padding-bottom: 10px;
		border-bottom: 1px solid #cccccc;
	}

	.date-item {
		margin: 0 6px;
		padding: 5px 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		cursor: pointer;
		display: inline-block;
		background-color: #f8f8f8;
		width: 20%;
		text-align: center;
	}

	.selected {
		color: white;
		background-color: #15C5CE;
	}

	/* 场次列表样式 */
	.show-list {
		width: 100%;
		padding: 10px;
	}

	.show-item {
		width: 100%;
		height: 150rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		border-bottom: 1px solid #cccccc;
	}

	.show-time {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.show-time .show-tm {
		margin: 0, 16rpx;
		font-size: 22px;

	}

	.show-time .show-stm {
		margin-top: 16rpx;
		margin-left: 2px;
		font-size: 14px;
		color: #666666;
	}

	.show-info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.show-lt {
		margin: 0, 16rpx;
		font-size: 16px;
	}

	.show-th {
		margin-top: 14rpx;
		margin-left: 2px;
		font-size: 14px;
		color: #666666;
	}

	.show-price {
		font-size: 22px;
		color: orangered;
		margin-bottom: 28px;
	}
</style>