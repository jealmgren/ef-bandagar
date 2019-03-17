Vue.component('route-book', {
	data() {
		return {
			circuits: [],
			dates: []
		}
	},
	methods: {
		// När användaren har tryckt på ett datum.
		redirect(circuitID, trackdayDate, circuitName) {
			this.$router.push(`/confirm/${circuitID}/${trackdayDate}/${circuitName}`);
		},
		// Hämta data för sidan.
		getTrackdays() {
			fetch('/api/getCircuits')
			.then(res => res.json())
			.then(data => {
				this.circuits = data.circuits;
			})
			fetch('/api/getTrackdayDates')
				.then(res => res.json())
				.then(data => {
					this.dates = data.trackdayDates;
			})
		}
	},
	created() {
		// Hämta alla bandagar.
		this.getTrackdays();
	},
	template: `
	<div class="container">
		<div class="row">
			<div class="col-sm-10 offset-sm-1">
				<div class="card text-white bg-dark">
					<div class="card-header">Bandagar</div>
					<div class="card-body">
						<div class="row">
							<div v-for="circuit in circuits">
								<div class="col-sm-12">
									<div class="card text-white bg-dark">
										<div class="card-header">{{ circuit.name }}</div>
										<div class="card-body">
											<button class="btn btn-primary" type="button" v-for="date in dates" v-on:click="redirect(date.circuitID, date.trackdayDate, circuit.name)" v-if="date.circuitID==circuit.circuitID">
												{{ date.trackdayDate }}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
});
