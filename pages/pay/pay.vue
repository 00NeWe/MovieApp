<template>
	<view class="container">
		<view class="movie-info">
			<view class="movie-details">
				<image class="movie-picture" :src=tickDetail.img></image>
				<view class="ticket-detail">
					<text class="movie-title">{{ tickDetail.name }}</text>
					<text class="movie-time"> {{tickDetail.date}}</text>
					<text class="movie-language"> {{ `${tickDetail.lang}${tickDetail.tp}` }}</text>
					<text class="cinema">{{cinema.name}}</text>
					<text class="location">6号厅6排5座</text>
					<text class="ticket-count">1张原价{{tickDetail.price}}</text>
				</view>
			</view>
			<view class="policy">
				<image class="logo" src="/static/jinggao2.png"></image>
				<text>不支持退票</text>
				<image class="logo" src="/static/jinggao2.png"></image>
				<text>不支持改签</text>
			</view>
			<button class="view-details">查看详情></button>
		</view>
		<view class="purchase-notice">
			<text class="title">购票须知</text>
			<view class="notice-list">
				<text>1.请提前30分钟左右到达影院现场，通过影院自助取票机完成取票。</text>
				<text>2.若取票过程中遇到无法取票等其它问题，请联系影院工作人员进行处理。</text>
				<text>3.请及时关注电影开场时间，凭票有序检票入场。</text>
				<text>4.如需开具电影票发票，可联系影院工作人员凭当日票根进行开具，若遇到特殊情况请及时联系猫眼客服人员。</text>
				<text>5.退票、改签服务请参考影院具体政策要求，特殊场次及部分使用卡、券场次订单可能不支持此服务。</text>
				<text>6.客服电话:1010-5335，工作时间:9:00-22:00，国家法定节假日延至24:00。</text>
			</view>
		</view>
		<view class="payment-details">
			<view class="agree-detail">
				<text>价格</text>
				<text style="color: orangered;"> ￥82</text>
			</view>
			<button class="confirm-payment" @click="confirmPayment">确认支付</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cinemaId: '',
				cinema: {
					name: '',
					addr: '',
				},
				sumPrice: '',
			};
		},
		onLoad: function(options) {
			console.log("options.sumPrice",options.sumPrice);
			this.sumPrice = options.sumPrice;
			
			console.log("this.sumPrice",this.sumPrice);
			this.fetchCinemaDetails();
		},
		computed: {

			tickDetail() {
				const {
					movieId,
					cinemaId,
					plist
				} = this.$store.state.currentSelected;
				console.log("movieId:", movieId);
				console.log("cinemaId:", cinemaId);
				console.log("plist:", plist);
				this.cinemaId = cinemaId;
				const cinema = this.$store.state.cinemaMovies;
				const movie = this.$store.state.cinemaMovies.find(m => m.id === movieId);

				console.log("cinemaMovies:", this.$store.state.cinemaMovies);
				console.log("Found movie:", movie);
				if (movie && plist) {
					return {
						name: movie.nm,
						movieId: movie.id,
						cinemaId: this.$store.state.currentSelected.cinemaId,
						date: plist.dt,
						img: movie.img,
						lang: plist.lang,
						tp: plist.tp,
						th: plist.th,
						price: plist.vipPrice
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
		methods: {
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
			confirmPayment() {
				// 显示“支付成功”提示
				uni.showToast({
					title: '支付成功',
					icon: 'success',
					duration: 2000, // 提示显示时间
					success: () => {
						// 2秒后跳转到目标 TabBar 页面
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/order/order' // 替换为你要跳转的 TabBar 页面路径
							});
						}, 2000); // 延迟2秒
					}
				});
			}
		},
	};
</script>

<style scoped>
	.page-detail {
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.confirm-order {
		margin-right: 200px;
		font-size: 18px;
		font-weight: bold;
	}

	.container {
		margin-top: 10px;
		background-color: #95a295;
		padding: 20px;

	}

	.movie-picture {
		height: 300rpx;
		width: 200rpx;
		margin-top: 0rpx;
		margin-left: 3rpx;
		margin-right: 40rpx;


	}

	.back {
		background-color: #15C5CE;
		color: white;
		margin-left: 3rpx;
		height: 32px;
		width: 32px;
	}

	.logo {
		height: 16px;
		width: 16px;
	}

	.movie-info {

		background-color: #f2f2f2;
		padding: 20px;
		border-radius: 10px;
		margin-bottom: 20px;
	}

	.movie-details {
		margin-top: 8px;
		display: flex;
	}

	.ticket-detail {
		margin-top: 1px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.movie-title {
		font-size: 18px;
		font-weight: bold;
	}

	.movie-description {
		font-size: 14px;
		color: #666;
	}

	.movie-time,
	.movie-language,
	.cinema,
	.location,
	.ticket-count {
		font-size: 14px;
		color: #333;
		margin-top: 5px;
	}

	.policy {
		margin-top: 10px;
		font-size: 16px;
		flex-direction: row;
		justify-content: space-between;
	}

	.view-details {
		margin-top: 20px;
		background-color: #15C5CE;
		color: white;
	}

	.purchase-notice {
		background-color: #f2f2f2;
		padding: 20px;
		border-radius: 10px;
		margin-bottom: 50px;
	}

	.notice-list {
		font-size: 14px;
		color: #333;
		margin-top: 5px;
		text-wrap: nowrap;
		flex-direction: column;
		justify-content: space-between;

	}

	.payment-details {
		background-color: #f2f2f2;
		padding: 10px;
		border-radius: 10px;
		font-size: 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.agree-detail {
		display: flex;
		flex-direction: column;

	}

	.confirm-payment {

		background-color: #15C5CE;
		color: white;
		border-radius: 5px;
		margin-left: 200px;
	}
</style>