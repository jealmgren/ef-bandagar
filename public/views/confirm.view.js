Vue.component('route-confirm', {
  data() {
    return {
      circuitID: this.$route.params.circuitID,
      trackdayDate: this.$route.params.trackdayDate,
      circuitName: this.$route.params.circuitName,
      loggedIn: 0,
      trackdayID: 0,
      socket: null,
      trackdays: [],
      columns: []
    }
  },
  methods: {
    // Hämta detaljer om bandagen.
    getTrackday() {
      fetch('/api/getTrackdayForConfirmation', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({circuitID: this.circuitID, trackdayDate: this.trackdayDate})
      })
      .then(res => res.json())
      .then(data => {
        this.trackdays = data.trackdays;
      })
    },
    // Användaren slutför sin bokning.
    confirm() {
      if (this.trackdayID !== 0) {
        fetch('/api/confirmBooking', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({trackdayID: this.trackdayID})
        })
        .then(res => res.json())
        .then(data => {
          if(data.success) {
            // Uppdaterar antalet lediga platser för alla andra som är inne på samma bandag.
            this.socket.emit("confirmedBooking");
            alert("Din bokning har lyckats! Klicka för att återgå till kalendern.")
            this.$router.push("/book");
          } else {
            alert("Bokningen misslyckades! Klicka för att återgå till kalendern");
            this.$router.push("/book");
          }
        })
      }      
    },
    // Användaren väljer att avbryta bokningen.
    cancel() {
      this.$router.push(`/book`);
    }
  },
  created() {
    this.socket = io().connect();

    // Kollar om användaren är inloggad.
    fetch('/api/isLoggedIn')
    .then(res => res.json())
    .then(data => {
      this.loggedIn = data.loggedIn;
      if (this.loggedIn) {
        this.getTrackday();
      }
    })
    
    $('#myModal').on('shown.bs.modal', function () {
      $('#myInput').trigger('focus')
    })

    // Lyssna på om andra har lagt en bokning.
		this.socket.on('confirmedBooking', data => {
      this.getTrackday();
  });

  },
  template: `
  <div class="container">
    <div v-if="loggedIn===false" class="panel panel-primary" >
      <div class="row">
        <div class="col-sm-6 offset-sm-3">
          <div class="card text-white bg-dark">
            <div class="card-body">
              <h5 class="card-title">Du måste logga in först.</h5>
              <a class="btn btn-danger" href="#/login" role="button">Klicka för att logga in/registrera</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loggedIn===true" class="panel panel-primary" >
      <div class="row">
      <div class="col-sm-6 offset-sm-3">
        <div class="card text-white bg-dark">
          <div class="card-body">
            <h5 class="card-title">Bokningsbekräftelse</h5>
            <p class="card-text">{{ 'Datum: ' }} {{ trackdayDate }}</p>
            <p class="card-text">{{ 'Bana: ' }} {{ circuitName }}</p>
            <tr v-for="trackday in trackdays">
              <td>
                <input type="radio" v-bind:value="trackday.trackdayID" v-model="trackdayID">
                  <label>{{trackday.pace}} - antal lediga platser: {{ trackday.NoOfVacan}}</label>
              </td>
            </tr>
            <div class="btn-group" role="group">
              <button class="btn btn-success" v-on:click="confirm()">Slutför bokningen</button>
              <button class="btn btn-danger" v-on:click="cancel()">Avbryt bokningen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
});
