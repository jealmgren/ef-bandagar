Vue.component('route-admin', {
	data() {
		return {
			//För att se alla banor, bokningar och bandagar.
			trackdays: [],
			trackday: '',
			circuit: '',
			trackdayColumns: [],
			bookings: [],
			bookingColumns: [],
			circuits: [],
			circuitColumns: [],

			// Variabler för att ta bort en bokning.
			removeBookingID: '',

			// Variabler för att lägga till en ny trackday.
			circuitID: '',
			trackdayDate: '',
			noParticipants: '',
			pace: '',

			// Variabler för att ta bort en trackday.
			removeTrackdayID: '',

			// Variabler för att lägga till en ny bana.
			newCircuitName: '',
			length: '',
			adress: '',
			image: '',
			info: '',
			url: ''
		}
	},
	methods: {
		// Hämta all data vid start av sidan.
		getAllData() {
			this.getCircuits();
			this.getTrackdays();
			this.getBookings();
		},
		// Hämta alla banor.
		getCircuits() {
			fetch('/api/getCircuitsAdmin')
				.then(res => res.json())
				.then(data => {
					this.circuits = data.circuits;
					this.circuitColumns = data.columns;
			})
		},
		// Hämta alla bandagar.
		getTrackdays() {
			fetch('/api/getTrackdays')
				.then(res => res.json())
				.then(data => {
					this.trackdays = data.trackdays;
					this.trackdayColumns = data.columns
			})
		},
		// Hämta lista med bokningar.
		getBookings() {
			fetch('/api/getBookings')
				.then(res => res.json())
				.then(data => {
					this.bookings = data.bookings;
					this.bookingColumns = data.columns;
			})
		},
		// Ta bort en bokning.
		removeBooking() {
			if (this.removeBookingID!='') {
				if (confirm('Är du säker på att du vill ta bort bokningen?')) {
					fetch('/api/removeBooking', {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({bookingID: this.removeBookingID})
					})
					.then(res => res.status())
					this.removeBookingID = '';
					this.getAllData();
				}
			}

		},
		// Lägg till en ny bana.
		addCircuit() {
			if (confirm('Är du säker på att du vill lägga till banan?')) {
				fetch('/api/addCircuit', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: this.newCircuitName,
						length: this.length,
						adress: this.adress,
						info: this.info,
						url: this.url
					})
				})
				.then(res => res.status())
				this.newCircuitName = '';
				this.length = '';
				this.adress = '';
				this.info = '';
				this.url = '';
				this.getAllData();

			}
		},
		// Ta bort en bandag.
		removeTrackday() {
			if (confirm('Är du säker på att du vill ta bort bandagen?')) {
				fetch('/api/removeTrackday', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({trackdayID: this.removeTrackdayID})
				})
				.then(res => res.status())
				this.getAllData();
				this.removeTrackdayID = 0;
			}
		},

		// Lägg till en bandag.
		addTrackday() {
			if (confirm('Är du säker på att du vill lägga till bandagen?')) {
				fetch('/api/addTrackday', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						circuitID: this.circuitID,
						trackdayDate: this.trackdayDate,
						noParticipants: this.noParticipants,
						pace: this.pace})
				})
				.then(res => res.status())
				this.circuitID = '';
				this.trackdayDate = '';
				this.noParticipants = '',
				this.pace = '';
				this.getAllData();
			}
		}
	},
	created() {
		this.socket = io().connect();
		this.getAllData();
	},
	template: `
<div class="container">
	<div class="row">
		<div class="col-sm-12">
			<div class="card text-white bg-dark">
				<div class="card-header">Admin</div>
				<div class="card-body">
					<ul class="nav nav-tabs" id="myTab" role="tablist">
						<li class="nav-item">
							<a class="nav-link active" id="bookings-tab" data-toggle="tab" href="#bookings" role="tab" aria-controls="bookings" aria-selected="true">Bokningar</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" id="circuits-tab" data-toggle="tab" href="#circuits" role="tab" aria-controls="circuits" aria-selected="false">Banor</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" id="trackdays-tab"  data-toggle="tab" href="#trackdays" role="tab" aria-controls="trackdays" aria-selected="false">Bandagar</a>
						</li>
					</ul>
					<div class="tab-content" id="myTabContent">
						<div class="tab-pane fade show active" id="bookings" role="tabpanel" aria-labelledby="bookings-tab">
							<table class="table table-dark">
								<thead>
									<tr>
										<th scope="col" v-for="column in bookingColumns">{{ column }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="booking in bookings">
										<td v-for="value in booking">{{ value }}</td>
									</tr>
								</tbody>
							</table>
							<form v-on:submit.prevent="removeBooking()">
								<div class="form-group row">
									<label for="selectForRemovalBooking" class="col-sm-1 col-form-label" >Bokning:</label>
									<div class="col-sm-3">
										<select class="form-control" id="selectForRemovalBooking" v-model="removeBookingID" required>
											<option disabled value="">Välj bokning att ta bort</option>
											<option v-for="booking in bookings">{{ booking.bookingID }}</option>
										</select>
									</div>
								</div>
								<div class="form-group row">
									<div class="col-sm-10">
										<button class="btn btn-danger" type="submit" >Ta bort bokning</button>	
									</div>
								</div>
							</form>
						</div>
						<div class="tab-pane fade" id="circuits" role="tabpanel" aria-labelledby="circuits-tab">
							<table class="table table-dark">
								<thead>
									<tr>
										<th scope="col" v-for="column in circuitColumns">{{ column }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="circuit in circuits">
										<td v-for="value in circuit">{{ value }}</td>
									</tr>
								</tbody>
							</table>
							<h5>Lägg till bana</h5>
							<form v-on:submit.prevent="addCircuit()">
								<div class="form-group row">
									<label for="circuitName" class="col-sm-1 col-form-label">Namn:</label>
									<div class="col-sm-3">
										<input type="text" class="form-control" id="circuitName" v-model="newCircuitName" placeholder="Ange banans namn" required>
									</div>
									<label for="length" class="col-sm-2 col-form-label">Längd:</label>
									<div class="col-sm-3">
										<input type="number" class="form-control" id="length" v-model="length" required placeholder="Ange längd på bana (km)">
									</div>
								</div>
								<div class="form-group row">
									<label for="adress" class="col-sm-1 col-form-label">Adress:</label>
									<div class="col-sm-3">
										<input type="text" class="form-control" id="noParticipants" v-model="adress" required placeholder="Ange adress">
									</div>
									<label for="image" class="col-sm-2 col-form-label">URL till bild:</label>
									<div class="col-sm-3">
										<input type="url" class="form-control" id="image" v-model="url" required placeholder="Ange bildadress">
									</div>
								</div>
								<div class="form-group row">
									<label for="info" class="col-sm-1 col-form-label">Info:</label>
									<div class="col-sm-8">
										<textarea class="form-control" rows="5" id="info" v-model="info" required></textarea>
									</div>
								</div>
								<div class="form-group row">
									<div class="col-sm-10">
										<input class="btn btn-primary" type="submit" value="Lägg till bana">
									</div>
								</div>
							</form>	
						</div>	
						<div class="tab-pane fade" id="trackdays" role="tabpanel" aria-labelledby="trackdays-tab">
							<table class="table table-dark">
								<thead>
									<tr>
										<th scope="col" v-for="column in trackdayColumns">{{ column }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="trackday in trackdays">
										<td v-for="value in trackday">{{ value }}</td>
									</tr>
								</tbody>
							</table>
							<h5>Ta bort bandag</h5>
							<form v-on:submit.prevent="removeTrackday()">
								<div class="form-group row">
									<label for="selectForRemovalTrackday" class="col-sm-1 col-form-label" >Bandag:</label>
									<div class="col-sm-3">
										<select class="form-control" id="selectForRemovalTrackday" v-model="removeTrackdayID" required>
											<option disabled value="">Välj bandag att ta bort</option>
											<option v-for="trackday in trackdays">{{ trackday.trackdayID }}</option>
										</select>
									</div>
								</div>
								<div class="form-group row">
									<div class="col-sm-10">
										<button class="btn btn-danger" type="submit" >Ta bort bandag</button>	
									</div>
								</div>
							</form>
							<h5>Lägg till bandag</h5>
							<form v-on:submit.prevent="addTrackday()">
								<div class="form-group row">
									<label for="selectCircuitForNewTrackday" class="col-sm-1 col-form-label">Bana:</label>
									<div class="col-sm-3">
										<select class="form-control" name="selectCircuitForNewTrackday" v-model="circuitID" required>
											<option disabled value="">Välj bana</option>
											<option :name="'groups_' + trackday.id" v-bind:value="circuit.circuitID" v-for="circuit in circuits">
												{{ circuit.name }}
											</option>
										</select>
									</div>
									<label for="trackdayDate" class="col-sm-1 col-form-label">Datum:</label>
									<div class="col-sm-3">
										<input type="date" class="form-control" id="trackdayDate"  v-model="trackdayDate" required>
									</div>
								</div>
								<div class="form-group row">
									<label for="noParticipants" class="col-sm-1 col-form-label">Antal:</label>
									<div class="col-sm-3">
										<input type="number" class="form-control" id="noParticipants" v-model="noParticipants" required placeholder="Välj antal deltagare">
									</div>
								</div>
								<div class="form-group">
									<div class="row">
										<legend class="col-form-label col-sm-1 pt-0">Grupp:</legend>
										<div class="col-sm-10">
											<div class="form-check">
												<input class="form-check-input" type="radio" name="gridRadios" id="slow" value="Långsam" v-model="pace" required>
												<label class="form-check-label" for="slow">Långsam</label>
											</div>
											<div class="form-check">
												<input class="form-check-input" type="radio" name="gridRadios" id="medium" value="Medel" v-model="pace">
												<label class="form-check-label" for="medium">Medel</label>
											</div>
											<div class="form-check">
												<input class="form-check-input" type="radio" name="gridRadios" id="fast" value="Snabb" v-model="pace">
												<label class="form-check-label" for="fast">Snabb</label>
											</div>
										</div>
									</div>
								</div>
								<div class="form-group row">
									<div class="col-sm-10">
										<input class="btn btn-danger" type="submit" value="Lägg till trackday">
									</div>
								</div>
							</form>				
						</div>									
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
	`
});
