<template>
	<view class="container">
		<!-- 订单列表 -->
		<view class="order-list">
			<view class="order-item">
				<image class="order-image" :src="tickDetail.img" mode="aspectFill"></image>
				<view class="order-info">
					<text class="order-title">{{tickDetail.name}}</text>
					<text class="order-time">{{tickDetail.date + ' ' + tickDetail.time}}</text>
					<text class="order-price">￥{{tickDetail.price }}</text>
					<text class="order-location">{{ tickDetail.th }}</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		computed: {
			tickDetail() {
				const {
					movieId,
					cinemaId,
					plist
				} = this.$store.state.currentSelected;
				
			
				const cinema = this.$store.state.cinemaMovies;
				const movie = this.$store.state.cinemaMovies.find(m => m.id === movieId);

				
				if (movie && plist) {
					return {
						name: movie.nm,
						date: plist.dt,
						time: plist.tm,
						th: plist.th,
						img: movie.img,
						price: plist.vipPrice,
					};
					console.log("Returning object:", JSON.stringify(result));
				} else {
					// 如果数据不全，返回默认值
					return {
						movieId: '',
						cinemaId: '',
						name: '',
						date: '',
						img: '',
						lang: '',
						tp: '',
						th: '',
						price: ''
					};
					console.log("Returning object:", JSON.stringify(result));
				}
			}
		},

	}
</script>
<style>
	.container {
		padding: 10px;
	}

	.title {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.order-list {
		display: flex;
		flex-direction: column;
	}

	.order-item {
		display: flex;
		align-items: center;
		margin-top: 20px;
		margin-bottom: 10px;
		padding: 10px;
		border-bottom: 1px solid #eee;
	}

	.order-image {
		width: 80px;
		height: 120px;
		margin-right: 30px;
	}

	.order-info {
		flex: 1;
	}

	.order-title,
	.order-time,
	.order-price,
	.order-location {
		display: block;
		margin-bottom: 5px;
	}

	.footer {
		display: flex;
		justify-content: space-around;
		padding: 10px 0;
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		border-top: 1px solid #eee;
	}

	.footer-item {
		text-align: center;
		padding: 5px 0;
	}

	.footer-item.active {
		color: #007aff;
	}
</style>