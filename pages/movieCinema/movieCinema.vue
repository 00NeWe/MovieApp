<template>

	<view class="cinema-selected">
		<!-- 导航栏 -->
		<view class="navbar" :style="{ opacity: navbarOpacity }">
			<uni-nav-bar :fixed="true" background-color="white" :border="false" status-bar left-icon="left"
				@clickLeft="back">
				<view class="nav-container">
					<image :src="movieDetail.img" class="navbar-icon"></image>
					<view class="navbar-right">
						<text class="navbar-title">{{ movieDetail.nm }}</text>
						<text class="navbar-sc">{{ movieDetail.sc }}分</text>
					</view>
				</view>
			</uni-nav-bar>
		</view>
		<uni-icons class="left-icon" type="back" size="30" color="#ffffff" @click="back"></uni-icons>
		<!-- 电影简单信息 -->
		<view class="cinema-info">
			<view class="cinema-img-container">
				<image :src="movieDetail.img" class="cinema-img"></image>
			</view>
			<view class="cinema-info-container">
				<view class="movie-title">{{movieDetail.nm}}</view>
				<text class="movie-text">{{movieDetail.enm}}</text>
				<text class="movie-text">{{movieDetail.cat}}</text>
				<text class="movie-text">{{movieDetail.pubDesc}}</text>
				<text class="movie-score">{{movieDetail.sc}} <text style="font-size: 28rpx;margin-left: 8rpx;">
						分</text></text>
				<button class="want-see" style="color: ghostwhite;" @click="buyTickets">
					<uni-icons :type="heartIcon" size="18" :color="heartIconColor"
						style="margin-right: 14rpx;"></uni-icons>
					{{wantStatus}}
				</button>
			</view>
			<view class="detail-img-container">
				<image :src="'/static/详情.png'" class="detail-img"></image>
			</view>
		</view>



		<view class="cinema-list-container">
			<!-- 日期滑动选择		 -->
			<view class="swiper-container">
				<view v-if="currentIndex > 0" class="arrow left-arrow"></view>
				<swiper class="date-picker" :current="currentIndex" @change="changeDate">
					<swiper-item v-for="(dateItem, index) in dates" :key="index">
						<text class="date-text">{{ dateItem.date }}</text>
					</swiper-item>
				</swiper>

				<view v-if="currentIndex < dates.length - 1" class="arrow right-arrow"></view>
			</view>
			<!-- 影院列表 -->
			<view class="cinema-list">
				<view v-if="currentCinemas.length === 0" class="no-cinema-message">
					<text>暂无影院</text>
				</view>
				<view v-else>
					<view v-for="(cinema, index) in currentCinemas" :key="index" class="cinema-item"
						@click="goToCinemaDetails(cinema.id,movieId)">
						<view class="cinema-top-row">
							<view class="cinema-name">
								<text>{{ cinema.name }}</text>
							</view>
							<text class="cinema-sellPrice">￥{{ cinema.sellPrice }}起</text>
						</view>
						<view class="cinema-mid-row">
							<view class="cinema-addr">
								<text>{{ cinema.addr }}</text>
							</view>
							<text class="cinema-distance">{{ cinema.distance }}</text>
						</view>
						<text class="cinema-showTimes">{{ cinema.showTimes }}</text>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		uniNavBar
	} from '@dcloudio/uni-ui';
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				navbarOpacity: 0,
				movieId: null,
				movieDetail: [],
				heartIcon: 'heart',
				heartIconColor: '#FFFFFF',
				wantStatus: '想看',
				dates: [],
				currentCinemas: [],
				currentIndex: 0,

			};
		},

		onLoad(options) {
			console.log(options.id);
			this.movieId = options.id;
			this.fetchMovieDetails();
			this.fetchDates();

		},
		onPageScroll(e) {
			const scrollTop = e.scrollTop;
			if (scrollTop > 0) {
				this.navbarOpacity = Math.min(1, scrollTop / 100);
			} else {
				this.navbarOpacity = 0;
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
						url: '/pages/index/index'
					});
				}
			},
			fetchMovieDetails() {
				wx.request({
					url: `https://apis.netstart.cn/maoyan/movie/intro?movieId=${this.movieId}`,
					method: 'GET',
					success: (res) => {
						if (res.statusCode === 200) {
							this.movieDetail = res.data.data.movie;
							console.log("电影详情数据：", this.movieDetail);
						}
					},
					fail: (err) => {
						console.error('请求错误', err);
					}
				});
			},
			buyTickets() {
				this.heartIcon = this.heartIcon === 'heart' ? 'heart-filled' : 'heart';
				this.heartIconColor = this.heartIconColor === '#FFFFFF' ? '#EC808D' : '#FFFFFF';
				this.wantStatus = this.wantStatus === '想看' ? '已想看' : '想看';

			},
			fetchDates() {
				uni.request({
					url: `https://apis.netstart.cn/maoyan/movie/showdays?movieId=${this.movieId}&cityId=20`,
					success: (res) => {
						if (res.data.success && res.data.data) {
							console.log("接收到的日期：", res.data.data);
							this.dates = res.data.data.dates;
							console.log("已接收到的日期：", this.dates);
							this.fetchCinemasForDate(this.dates[0].date);
						}
					},
					fail: (err) => {
						console.error('请求日期失败', err);
					}
				});
			},
			fetchCinemasForDate(date) {
				uni.request({
					url: `https://apis.netstart.cn/maoyan/movie/select/cinemas?showDate=${date}&movieId=${this.movieId}&cityId=421`,

					success: (res) => {
						if (res.data.success) {
							this.currentCinemas = res.data.data.cinemas;
							this.currentIndex = this.dates.findIndex(d => d.date === date);
							console.log("影院列表:", this.currentCinemas);
							console.log("currentIndex :", this.currentIndex);
						} else {
							console.error('请求影院信息失败', res.data.errMsg);
						}
					},
					fail: (err) => {
						console.error('请求影院信息失败', err);
					}
				});
			},
			changeDate(e) {
				const index = e.detail.current;
				const selectedDate = this.dates[index].date;
				this.currentIndex = index;
				this.fetchCinemasForDate(selectedDate);
			},
            goToCinemaDetails(cinemaId,movieId) {
				console.log("影院id",cinemaId);
				console.log("电影id",movieId);
                  wx.navigateTo({
                       url: `/pages/selectTime/selectTime?cinemaId=${cinemaId}&movieId=${movieId}`
                      });
            }
		}
	};
</script>
<style>
	page {

		background-image: url('/static/背景.png');
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
<style scoped>
	/* ************************************顶部导航栏 */
	.navbar {
		position: sticky;
		top: 0;
		z-index: 1000;
	}

	.left-icon {
		position: absolute;
		left: 10px;
		top: 8%;
		transform: translateY(-50%);
		opacity: 1;
		font-size: 16px;
		cursor: pointer;
	}

	.uni-navbar-left-text {
		display: none;
	}

	.nav-container {
		position: absolute;
		height: 41px;
		left: 40px;
		top: 45px;
		display: flex;
		justify-content: start;
	}

	.navbar-icon {
		width: 30px;
		height: 41px;
		border-radius: 5px;
		margin-right: 10px;
	}

	.navbar-right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.navbar-title {
		color: black;
		font-size: 16px;
		color: black;

	}

	.navbar-sc {
		color: #ebc459;
	}

	/* ************************************* ******************电影简介 */
	.cinema-info {
		display: flex;
		justify-content: space-around;
		/* margin:40rpx,36rpx,46rpx,20rpx; */
		margin-top: 40rpx;
		margin-left: 36rpx;
		margin-bottom: 64rpx;
		margin-right: 16rpx;
	}

	.cinema-img {
		width: 220rpx;
		height: 310rpx;
		border-radius: 20rpx;
		margin-right: 26rpx;
	}

	.cinema-info-container {
		width: 400rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-right: 10rpx;
	}

	.movie-title {
		color: #FFFFFF;
		font-size: 42rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.movie-text {
		color: #BBC7C7;
		font-size: 28rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.movie-score {
		font-size: 40rpx;
		color: #ebc459;
	}

	.detail-img-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.detail-img {
		width: 50rpx;
		height: 50rpx;
	}

	.want-see {
		height: auto;
		border-radius: 18rpx;
		width: 240rpx;
		font-size: 32rpx;
		background-color: #7C9393;
		margin-left: 0;
		margin-top: 24rpx;

	}

	/* ******************************************************影院列表 */
	.cinema-list-container {
		background-color: white;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}

	.date-picker {
		display: flex;
		width: 100%;
		height: 90rpx;
		overflow-x: auto;

		align-items: center;
		justify-content: center;
	}

	.date-picker swiper-item {
		min-width: 60px;
		text-align: center;
		padding-top: 24rpx;
	}

	.swiper-container {
		position: relative;
	}

	.arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 6px;
	}

	.left-arrow {
		left: 10px;
		border-color: transparent #15C5CE transparent transparent;
	}

	.right-arrow {
		right: 10px;
		border-color: transparent transparent transparent #15C5CE;
	}

	.cinema-list {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
	}

	.no-cinema-message {
		height: 58rpx;
		font-size: 40rpx;
		padding: 68rpx;
		text-align: center;
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
	}

	.cinema-item {
		width: 95%;
		height: 150rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
		margin-left: 20rpx;
		margin-right: 20rpx;
		padding-top: 28rpx;
		padding-bottom: 20rpx;
	}

	.cinema-top-row {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;


	}

	.cinema-sellPrice {
		font-size: 30rpx;
		color: orangered;
	}

	.cinema-mid-row {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		font-size: 24rpx;
		color: #666666;
	}

	.cinema-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 36rpx;
		width: 80%;
	}

	.cinema-addr {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 80%;
	}

	.cinema-showTimes {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 24rpx;
		color: #666666;
	}
</style>