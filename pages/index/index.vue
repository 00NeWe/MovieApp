<template>
	<view>
		<view class="position-container">
			<image src="/static/ico-m20-w20-horror.png" class="image" style="width: 20px;height: 20px;"></image>
			<view class="text-container">
				<text class="text">广州▼</text>

			</view>
		</view>

		<view class="swiper-container">
			<swiper class="swiper" circular autoplay indicator-dots :interval="3000" :duration="500"
				indicator-color="#808080" indicator-active-color="#FF8C00" style="height: 120px;">
				<swiper-item v-for="item in imgs" :key="item">
					<image :src="item" alt="" mode="widthFix" style="width: 100%;" class="swiper-image"></image>

				</swiper-item>
			</swiper>
		</view>

		<view class="movie-scroll-container">
			<view class="movie-scroll-container-title">正在热映</view>
			<scroll-view class="movie-scroll" scroll-x="true">
				<view class="movie-row">
					<view class="movie-item" v-for="(movie, index) in movieList" :key="index">
						<image :src="movie.img" alt="" class="movie-poster" />
						<text class="movie-title">{{ movie.nm }}</text>
						<button class="scroll-item-button" @click="goToMovieCinema(movie.id)">购票</button>
					</view>
					<view class="more-movie-container">
						<image src="/static/更多.jpg" class="more-movie"></image>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgs: [
					"/static/swiper1.jpg",
					"/static/swiper2.jpg",
					"/static/swiper3.jpg"
				],
				movieList: []
			}
		},
		onLoad() {
			this.fetchMovies();
		},
		methods: {
			fetchMovies() {
				wx.request({
					url: 'https://apis.netstart.cn/maoyan/index/movieOnInfoList',
					method: 'GET',
					success: (res) => {
						if (res.statusCode === 200) {
							this.movieList = res.data.movieList;
						}
					},
					fail: (err) => {
						console.error('请求错误', err);
					}
				});
			},
			goToMovieCinema(id) {

				wx.navigateTo({
					url: `/pages/movieCinema/movieCinema?id=${id}`
				});
			},
		}
	}
</script>

<style>
	page {

		background-image: url('/static/bj2.jpg');
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
<style lang="scss" scoped>
	.swiper-image {
		border-radius: 10px;
		overflow: hidden;

	}

	.swiper-container {

		z-index: 100;
	}

	.swiper {
		margin: 15px;
	}

	.position-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		margin-left: 20px;
	}

	.image {
		width: 100%;
		height: auto;
		margin-top: 20px;
		margin-right: 5px;
	}

	.text-container {
		margin-top: 20px;
	}

	.text {
		font-size: 16px;
		color: #333;
	}

	// 横向滚动展示
	.movie-scroll-container {
		height: 230px;
		background-color: #ffffff;
		border-radius: 10px;
		margin: 15px;
	}

	.movie-scroll-container-title {
		font-size: 18px;
		font-weight: bold;
		padding: 15px;
	}

	.movie-scroll {
		height: 230px;
		background-color: #ffffff;
	}

	.movie-row {
		display: flex;
		justify-content: space-between;
	}

	.movie-item {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin-left: 10px;
		width: 100px;
	}

	.movie-poster {
		width: 100px;
		height: 137px;
		border-radius: 10px;
	}

	.movie-title {
		width: 100px;
		margin-top: 5px;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.scroll-item-button {
		font-size: 14px;
		color: white;
		background-color: #15C5CE;
		border-radius: 18px;
		margin-top: 10px;
	}

	.more-movie-container {}

	.more-movie {
		width: 100px;
		height: 137px;
		border-radius: 10px;
		margin-left: 10px;
		margin-right: 10px;
	}
</style>